/**
 * Centralised extraction of a human-readable message from an API failure.
 *
 * The backend is not consistent about the shape of an error body:
 *   - plain text           -> "User not found"          (res.send)
 *   - { message }          -> { message: "Plan not found" }
 *   - { error }            -> { error: "Invalid username or password" }
 *   - { success, error, message } -> rate limiter responses
 *   - network / timeout    -> axios throws without a response
 *
 * Everything funnels through here so every screen shows the same thing.
 */

const GENERIC_ERROR = "Something went wrong. Please try again.";

const NETWORK_ERROR = "We can't reach the server. Check your connection and try again.";

const STATUS_MESSAGES = {
  400: "That request wasn't valid. Please check the details and try again.",
  401: "Your session has expired. Please sign in again.",
  403: "You don't have permission to do that.",
  404: "We couldn't find what you were looking for.",
  409: "That already exists.",
  422: "Please check the details you entered and try again.",
  429: "Too many attempts. Please wait a moment and try again.",
  500: "Our servers hit a snag. Please try again in a moment.",
  502: "Our servers hit a snag. Please try again in a moment.",
  503: "Our servers hit a snag. Please try again in a moment.",
  504: "The server took too long to respond. Please try again.",
};

/** Pull the first usable string out of an unknown payload. */
function firstString(...candidates) {
  for (const candidate of candidates) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }
  return "";
}

/**
 * True when the message is a generic/technical string we would rather not
 * show verbatim to a user (e.g. "Server error", "Something went wrong").
 */
function isUnhelpfulMessage(message) {
  if (!message) return true;
  const normalised = message.trim().toLowerCase();
  const unhelpful = [
    "server error",
    "error fetching hostels",
    "internal server error",
    "something went wrong",
    "something went wrong, try again !!",
    "unauthorized",
    "forbidden",
    "invalid token",
    "no token provided",
    "bad request",
    "error",
  ];
  return unhelpful.some((phrase) => normalised === phrase);
}

/**
 * Build a friendly, specific message for an axios error.
 * @param {unknown} error - the caught error from an axios call
 * @param {object} [options]
 * @param {string} [options.fallback] - message used when nothing better is available
 * @param {boolean} [options.useServerMessage=true] - allow the server's message through
 * @returns {string}
 */
export function getErrorMessage(error, options = {}) {
  const { fallback = GENERIC_ERROR, useServerMessage = true } = options;

  if (!error) return fallback;

  // No response => the request never reached the server (offline, DNS, CORS).
  if (!error.response) {
    if (error.code === "ECONNABORTED") {
      return "That took too long. Please check your connection and try again.";
    }
    return NETWORK_ERROR;
  }

  const { status, data } = error.response;

  const serverMessage = firstString(
    typeof data === "string" ? data : "",
    data?.message,
    data?.error,
    typeof data?.error === "string" ? data.error : "",
  );

  if (useServerMessage && serverMessage && !isUnhelpfulMessage(serverMessage)) {
    return serverMessage;
  }

  return STATUS_MESSAGES[status] || fallback;
}

/**
 * True when the failure was caused by bad credentials / an expired session,
 * so the caller can redirect to the login page.
 */
export function isAuthError(error) {
  return error?.response?.status === 401 || error?.response?.status === 403;
}

/**
 * The login endpoints return a distinct message for "no such account" and for
 * "wrong password". Showing which one applied would let anyone probe for
 * registered email addresses, so both are presented as one neutral message.
 */
const CREDENTIAL_MESSAGES = new Set([
  "user not found",
  "wrong password",
  "invalid email or password",
  "invalid username or password",
  "incorrect email or password",
  "username and password are required",
]);

export const INVALID_CREDENTIALS_MESSAGE = "Incorrect email or password.";

/**
 * True when the server rejected the supplied credentials (as opposed to
 * failing for some other reason such as a rate limit or a server error).
 */
export function isCredentialRejection(error) {
  const status = error?.response?.status;
  if (status !== 400 && status !== 401) return false;

  const data = error.response.data;
  const message = firstString(
    typeof data === "string" ? data : "",
    data?.message,
    data?.error,
  ).toLowerCase();

  return CREDENTIAL_MESSAGES.has(message);
}

/**
 * True when the request was blocked by the rate limiter.
 */
export function isRateLimitError(error) {
  return error?.response?.status === 429;
}

/**
 * True when the request failed for a reason the user could not have caused
 * (server error, timeout, offline).
 */
export function isNetworkOrServerError(error) {
  const status = error?.response?.status;
  return !error?.response || status >= 500;
}
