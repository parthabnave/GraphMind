const jwt = require('jsonwebtoken');
const secret = require("../secret"); // Ensure this path is correct

function UserVerification(req, res, next) {
    // Get the token from the request header
    const token = req.header('token')?.split(' ')[1]; // Use optional chaining to avoid errors if 'token' is undefined

    // Check if the token is provided
    if (!token) {
        return res.status(403).json({ msg: "Access denied. No token provided." });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, secret);
        req.user = decoded; // Attach the decoded user information to the request object
        next(); // Call the next middleware or route handler
    } catch (error) {
        // Handle token verification errors
        console.error("Token verification error:", error);
        return res.status(401).json({ msg: "Token is not valid." });
    }
}

module.exports = UserVerification;