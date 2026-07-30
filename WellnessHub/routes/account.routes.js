const express = require("express");
const router = express.Router();

const {
    loginAccount,
    getCurrentAccount
} = require("../controllers/account.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

// Public login route
router.post("/login", loginAccount);

// Protected route for retrieving the logged-in account
router.get("/me", verifyToken, getCurrentAccount);

module.exports = router;