const Account = require("../models/account.model");
const Article = require("../models/article.model");
const jwt = require("jsonwebtoken");

const fetchAllLikes = async (req, res) => {
    try {
        const account = await Account.findById(req.account.accountId);
        
        return res.status(200).json({
            message: "Likes fetched successfully.",
            likes: account.userData?.likes || []
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch likes.",
            error: error.message
        });
    }
};

const fetchLikesByCategory = async (req, res) => {
    try {
        const account = await Account.findById(req.account.accountId);
        const category = req.params.category;
        const likes = account.userData?.likes
            .filter(like => like.category === category);

        if (!likes || likes.length === 0) {
            return res.status(404).json({
                message: "No likes found for the specified category."
            });
        }

        return res.status(200).json({
            message: "Likes fetched successfully.",
            likes
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch likes.",
            error: error.message
        });
    }
};

const fetchLikesByType = async (req, res) => {
    try {
        const account = await Account.findById(req.account.accountId);
        const type = req.params.type;
        const likes = account.userData?.likes
            .filter(like => like.type === type);

        if (!likes || likes.length === 0) {
            return res.status(404).json({
                message: "No likes found for the specified type."
            });
        }

        return res.status(200).json({
            message: "Likes fetched successfully.",
            likes
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch likes.",
            error: error.message
        });
    }
};

const updateLikes = async (req, res) => {
    try {
        const { category, type } = req.body;
        console.log(category, type);
        const account = await Account.findById(req.account.accountId);
        if (!account) {
            res.status(404).json({
                message: "Account not found.",
                error: error.message
            })
        }

        const like = account.userData.likes
            .filter(like => like.category === category)
            .find(like => like.type === type);

        if (!like) {
            account.userData.likes.push({
                category: category,
                type: type,
                likes: 1
            });
            await account.save();
            return res.status(201).json({
                message: "Successfully added like.",
                account
            });
        } else {
            like.likes += 1;
            await account.save();
            return res.status(200).json({
                message: "Successfully updated likes.",
                account
            });
        }

    } catch (error) {
        return res.status(500).json({
            message: "Unable to access likes.",
            error: error.message
        });
    }
};

const fetchHighestLikes = async (req, res) => {
    try {
        const account = await Account.findById(req.account.accountId);
        const highestLike = account.userData.likes.sort((a, b) => b.likes - a.likes)[0];

        return res.status(200).json({
            message: "Highest likes retrieved successfully.",
            highestLike
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to access likes.",
            error: error.message
        });
    }
};

module.exports = {
    fetchAllLikes,
    fetchLikesByCategory,
    fetchLikesByType,
    updateLikes,
    fetchHighestLikes
}