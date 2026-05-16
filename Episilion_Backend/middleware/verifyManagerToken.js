const jwt = require("jsonwebtoken");

// Middleware: Verify manager JWT token
const verifyManagerToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Check if Authorization header exists and starts with "Bearer"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Access denied", // No token provided
      });
    }

    // 2. Extract token from header
    const token = authHeader.split(" ")[1];

    // 3. Verify token using secret key
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
      error: "Invalid or expired token",
    });
  }
};

module.exports = verifyManagerToken;
