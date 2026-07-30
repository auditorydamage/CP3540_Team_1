const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authorizationHeader = req.headers.authorization;

    // Check that the header contains a Bearer token
    if (
        !authorizationHeader ||
        !authorizationHeader.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            message: "Authentication token is required."
        });
    }

    // Extract the token
    const token = authorizationHeader.split(" ")[1];

    try {
        // Verify and decode the token
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        // Pass the account information to the next function
        req.account = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

module.exports = {
    verifyToken
};