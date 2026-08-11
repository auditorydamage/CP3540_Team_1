const express = require("express");
const router = express.Router();

const {
    loginAccount,
    getCurrentAccount,
    registerAccount,
    activateAccount,
    deleteAccount,
    getAccounts,
    getAccountById,
    modifyAccount,
    changePassword
} = require("../controllers/account.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

// Public login route
router.post("/login", loginAccount);
router.post("/register", registerAccount);
router.put("/activate", verifyToken, activateAccount);
router.delete("/delete", verifyToken, deleteAccount);
router.get("/list", verifyToken, getAccounts);
router.get("/:id", verifyToken, getAccountById);
router.put("/:id", verifyToken, modifyAccount);
router.put("/password", verifyToken, changePassword);

// Protected route for retrieving the logged-in account
router.get("/me", verifyToken, getCurrentAccount);

module.exports = router;