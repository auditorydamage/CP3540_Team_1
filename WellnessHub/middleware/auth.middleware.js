const jwt = require("jsonwebtoken");

// Verify the JWT token
const verifyToken = (req, res, next) => {
    const authorizationHeader = req.headers.authorization;

    if (
        !authorizationHeader ||
        !authorizationHeader.startsWith("Bearer ")
    ) {
        return res.status(401).json({
            message: "Authentication token is required."
        });
    }

    const token = authorizationHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({
            message: "Authentication token is required."
        });
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.account = decodedToken;
        next();
    } catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token."
        });
    }
};

// Check whether the account has an allowed role
const authorizeRoles = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.account) {
            return res.status(401).json({
                message: "Authentication is required."
            });
        }

        if (!allowedRoles.includes(req.account.accountType)) {
            return res.status(403).json({
                message: "You do not have permission to access this resource."
            });
        }

        next();
    };
};

module.exports = {
    verifyToken,
    authorizeRoles
};