const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  try {
    // Get authorization header
    const authHeader = req.headers.authorization;

    // Check if token exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "No token provided vg",
      });
    }

    // Extract token
    const token = authHeader.split(" ")[1];

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