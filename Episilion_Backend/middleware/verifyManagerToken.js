const jwt = require("jsonwebtoken");
const extractToken = require("../utils/extractToken");

// Middleware: Verify manager JWT token
const verifyManagerToken = (req, res, next) => {

  try {
    // Get the token from the Authorization header. Both "Bearer <token>"
    // and a bare token are accepted.
    const token = extractToken(req);

    // 1. Check if a token was provided at all
    if (!token) {
      return res.status(401).json({
        error: "Access denied", // No token provided
      });
    }

    // 2. Verify token using secret key
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 4. Save decoded payload (managerId, hostelId, etc.) into req.user
    req.user = decoded;

    // 5. Continue to next middleware or route handler
    next();
  } catch (error) {
    console.error(error);

    // If verification fails (invalid/expired token), deny access
    return res.status(401).json({
      error: "Something is wrong, try again !!",//Invalid or expired token
    });
  }
};

module.exports = verifyManagerToken;
