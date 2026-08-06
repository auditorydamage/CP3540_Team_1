const Account = require("../models/account.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginAccount = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Validate the required login information.
        if (!username || !password) {
            return res.status(400).json({
                message: "Username and password are required."
            });
        }

        const account = await Account.findOne({ username });

        if (!account) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Compare the submitted password with the stored password hash.
        const passwordMatches = await bcrypt.compare(
            password,
            account.password
        );

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Invalid username or password."
            });
        }

        // Create a JWT for accessing protected routes.
        const token = jwt.sign(
            {
                accountId: account._id,
                accountType: account.accountType
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        return res.status(200).json({
            message: "Login successful.",
            token,
            account: {
                id: account._id,
                username: account.username,
                accountType: account.accountType
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to log in.",
            error: error.message
        });
    }
};

const registerAccount = async (req, res) => {
    try {
        const { username, password, accountType } = req.body;
        const existingUser = await Account.findOne({ username });
        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new Account({
            username,
            password: hashedPassword,
            accountType
        });

        await newAccount.save();

        return res.status(201).json({
            message: "Account created successfully.",
            account: {
                id: newAccount._id,
                username: newAccount.username,
                accountType: newAccount.accountType
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to register account.",
            error: error.message
        });
    }
};

const activateAccount = async (req, res) => {
    try {
        const { username } = req.body;
        const account = await Account.findOne({ username });
        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        account.isActive = true;
        await account.save();

        return res.status(200).json({
            message: "Account activated successfully.",
            account: {
                id: account._id,
                username: account.username,
                accountType: account.accountType,
                isActive: account.isActive
            }
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to activate account.",
            error: error.message
        });
    }
}

const getCurrentAccount = async (req, res) => {
    try {
        // Retrieve the authenticated account without returning its password.
        const account = await Account.findById(
            req.account.accountId
        ).select("-password");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        return res.status(200).json({
            message: "Account retrieved successfully.",
            account
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve account.",
            error: error.message
        });
    }
};

module.exports = {
    loginAccount,
    getCurrentAccount
};