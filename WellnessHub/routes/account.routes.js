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
router.get("/me", verifyToken, getCurrentAccount);
router.put("/password", verifyToken, changePassword);
router.put("/activate/:id", verifyToken, activateAccount);
router.delete("/:id", verifyToken, deleteAccount);
router.get("/list", verifyToken, getAccounts);
router.get("/:id", verifyToken, getAccountById);
router.put("/:id", verifyToken, modifyAccount);


module.exports = router;