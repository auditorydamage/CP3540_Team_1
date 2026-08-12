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
        const { username, password, emailAddress } = req.body;

        if (!username || !password || !emailAddress) {
            return res.status(400).json({
                message: "Username, password, and email address are required."
            });
        }

        const existingUser = await Account.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists."
            });
        }

        const existingEmail = await Account.findOne({ emailAddress });

        if (existingEmail) {
            return res.status(400).json({
                message: "Email address already in use."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAccount = new Account({
            username,
            password: hashedPassword,
            accountType: "user",
            emailAddress
        });

        await newAccount.save();

        return res.status(201).json({
            message: "Account created successfully.",
            account: {
                id: newAccount._id,
                username: newAccount.username,
                accountType: newAccount.accountType,
                emailAddress: newAccount.emailAddress
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
        const account = await Account.findById(
            req.account.accountId
        ).select("-password");

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

const deleteAccount = async (req, res) => {
    try {
        const account = await Account.findByIdAndDelete(
            req.account.accountId
        );

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        return res.status(200).json({
            message: "Account deleted successfully."
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete account.",
            error: error.message
        });
    }
};

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

const getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find().select("-password");
        return res.status(200).json({
            message: "Accounts retrieved successfully.",
            accounts
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to retrieve accounts.",
            error: error.message
        });
    }
};

const getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id).select("-password");

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

const modifyAccount = async (req, res) => {
    try {
        const account = await Account.findByIdAndUpdate(req.params.id, req.body).select("-password");

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        return res.status(200).json({
            message: "Account updated successfully.",
            account
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update account.",
            error: error.message
        });
    }
};

const changePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                message: "Old and new passwords are required."
            });
        }

        const account = await Account.findById(req.account.accountId);

        if (!account) {
            return res.status(404).json({
                message: "Account not found."
            });
        }

        const passwordMatches = await bcrypt.compare(oldPassword, account.password);

        if (!passwordMatches) {
            return res.status(401).json({
                message: "Old password is incorrect."
            });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        account.password = hashedPassword;
        await account.save();

        return res.status(200).json({
            message: "Password changed successfully."
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to change password.",
            error: error.message
        });
    }
};
        

module.exports = {
    loginAccount,
    getCurrentAccount,
    registerAccount,
    activateAccount,
    deleteAccount,
    getAccounts,
    getAccountById,
    modifyAccount,
    changePassword
};