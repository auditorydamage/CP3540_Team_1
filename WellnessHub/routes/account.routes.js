const express = require("express");
const router = express.Router();

const {
    loginAccount
} = require("../controllers/account.controller");

// Login route
router.post("/login", loginAccount);

module.exports = router;