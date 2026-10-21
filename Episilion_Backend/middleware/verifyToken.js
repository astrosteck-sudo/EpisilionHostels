const jwt = require("jsonwebtoken");
const extractToken = require("../utils/extractToken");

const verifyToken = (req, res, next) => {
  try {
    // Get the token from the Authorization header. Both "Bearer <token>"
    // and a bare token are accepted.
    const token = extractToken(req);

    if (!token) {
      return res.status(401).json({
        error: "No token provided vg",
      });
    }

    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // Save user data into request
    req.user = decoded;

    next();

  } catch (err) {
    console.log(err);

    return res.status(401).json({
      error: "Something is wrong, try again !!",//Invalid or expired token
    });
  }
};

module.exports = verifyToken;