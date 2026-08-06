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
router.post("/register", verifyToken,registerAccount);
router.put("/activate", verifyToken, activateAccount);
router.delete("/delete", verifyToken, deleteAccount);

// Protected route for retrieving the logged-in account
router.get("/me", verifyToken, getCurrentAccount);

module.exports = router;