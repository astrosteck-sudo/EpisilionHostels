/**
 * Centralised rate limiting for the Episilion API.
 *
 * Limiters are keyed by the authenticated user when one is available and fall
 * back to the client IP (IPv6-safe) otherwise, so a single abusive account
 * cannot hide behind a shared NAT address and a single IP cannot exhaust
 * another user's quota.
 *
 * Every limit can be tuned from the environment without a code change, e.g.
 * `RATE_LIMIT_AUTH_MAX=30`.
 */
const { rateLimit, ipKeyGenerator } = require("express-rate-limit");
const jwt = require("jsonwebtoken");

const MINUTE = 60 * 1000;

function envInt(name, fallback) {
  const value = Number.parseInt(process.env[name], 10);
  return Number.isInteger(value) && value > 0 ? value : fallback;
}

/**
 * Resolve a stable identity for the caller.
 *
 * Limiters run before the auth middleware, so `req.user` is usually empty at
 * this point. We therefore verify the bearer token here (same secret the auth
 * middleware uses) and key on the account id it carries. Invalid or missing
 * tokens fall back to the client IP, which is what unauthenticated traffic
 * should be limited by anyway.
 */
function userOrIp(req) {
  const known = req.user?.user_id ?? req.user?.id ?? req.user?.managerId;
  if (known) return `user:${known}`;

  const authHeader = req.headers.authorization;
  if (authHeader?.startsWith("Bearer ")) {
    try {
      const decoded = jwt.verify(authHeader.slice(7), process.env.JWT_SECRET);
      const id = decoded.user_id ?? decoded.id ?? decoded.managerId;
      if (id) return `user:${id}`;
    } catch {
      // Invalid/expired token: fall through to IP-based limiting.
    }
  }

  return ipKeyGenerator(req.ip);
}

function ipOnly(req) {
  return ipKeyGenerator(req.ip);
}

function jsonHandler(message) {
  return (req, res, _next, options) => {
    res.status(options.statusCode).json({
      success: false,
      error: "rate_limit_exceeded",
      message,
    });
  };
}

function createLimiter({
  windowMs,
  limit,
  message,
  keyGenerator = userOrIp,
  skipSuccessfulRequests = false,
  skip,
}) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    keyGenerator,
    skipSuccessfulRequests,
    handler: jsonHandler(message),
    ...(skip ? { skip } : {}),
  });
}

// Broad safety net for every /api request. Deliberately generous: it exists to
// absorb floods, not to police normal browsing.
const globalLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: envInt("RATE_LIMIT_GLOBAL_MAX", 1000),
  message: "Too many requests. Please slow down and try again in a few minutes.",
  keyGenerator: ipOnly,
  // Paystack webhooks are signature-verified and must never be dropped.
  skip: (req) => req.originalUrl.startsWith("/api/payments/webhook"),
});

// Credential endpoints. Only failed attempts count, so a legitimate user is
// never locked out by their own successful logins.
const authLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: envInt("RATE_LIMIT_AUTH_MAX", 20),
  message:
    "Too many authentication attempts. Please wait 15 minutes and try again.",
  keyGenerator: ipOnly,
  skipSuccessfulRequests: true,
});

// The AI search endpoint fans out to an external LLM, so it is the most
// expensive route in the API.
const aiLimiter = createLimiter({
  windowMs: 5 * MINUTE,
  limit: envInt("RATE_LIMIT_AI_MAX", 20),
  message: "You are searching too quickly. Please wait a moment and try again.",
});

// State-changing endpoints (reviews, favourites, manager updates).
const writeLimiter = createLimiter({
  windowMs: 10 * MINUTE,
  limit: envInt("RATE_LIMIT_WRITE_MAX", 40),
  message: "Too many changes in a short time. Please slow down.",
});

// Payment initialisation and verification.
const paymentLimiter = createLimiter({
  windowMs: 10 * MINUTE,
  limit: envInt("RATE_LIMIT_PAYMENT_MAX", 20),
  message: "Too many payment requests. Please wait a few minutes.",
});

// Newsletter and waitlist sign-ups.
const subscribeLimiter = createLimiter({
  windowMs: 60 * MINUTE,
  limit: envInt("RATE_LIMIT_SUBSCRIBE_MAX", 5),
  message: "Too many sign-up attempts. Please try again later.",
  keyGenerator: ipOnly,
});

// Public read endpoints (hostel list, reviews, static JSON).
const readLimiter = createLimiter({
  windowMs: 5 * MINUTE,
  limit: envInt("RATE_LIMIT_READ_MAX", 300),
  message: "Too many requests. Please slow down.",
});

// Paystack webhook deliveries: generous, but still bounded.
const webhookLimiter = createLimiter({
  windowMs: 15 * MINUTE,
  limit: envInt("RATE_LIMIT_WEBHOOK_MAX", 600),
  message: "Too many webhook deliveries.",
  keyGenerator: ipOnly,
});

module.exports = {
  globalLimiter,
  authLimiter,
  aiLimiter,
  writeLimiter,
  paymentLimiter,
  subscribeLimiter,
  readLimiter,
  webhookLimiter,
};
