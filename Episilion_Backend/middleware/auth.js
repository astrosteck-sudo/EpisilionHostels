const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
    const token = req.headers.authorization;
    // console.log(token)
    //console.log("Auth Middleware - Token received:", token);

    // 1. Check if token exists
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }

    try {
        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Attach user info to request
        req.user = decoded;

        // 4. Allow request to continue
        next();

    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
}

module.exports = authMiddleware;