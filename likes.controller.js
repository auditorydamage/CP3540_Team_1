const Likes = require("../models/account.model");
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

const fetchLikesByType = async (req, res) => {
    try {
        const account = await Account.findById(req.account.accountId);
        const type = req.params.type;
        const likes = Account.find({ "account.userData?.likes.type": type });

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
}

const createLikes = async (req, res) => {
    try {
        const { category, type } = req.body;
        const account = await Account.findById(req.account.accountId);
        if (!account.userData) {
            account.userData = {};
        }
        if (!account.userData.likes) {
            account.userData.likes = [];
        }
        account.userData.likes.push({
            category: category,
            type: type,
            number: 1
        })

        await account.save();

        const newLike = account.userData.likes[account.userData.likes.length - 1];
        
        return res.status(201).json({
            message: "Like added successfully.",
            newLike
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add like.",
            error: error.message
        });
    }
};

const likesByActivity = async (req, res) => {
    try {
        const activityType = req.params.activityType;
        const account = await Account.findById(req.account.accountId);
        if (!account.userData) {
            account.userData = {};
        }
        if (!account.userData.likes) {
            account.userData.likes = [];
        }
        
        const like = account.userData.likes.type.findOne ({ type: activityType});
        if (!like) {
            account.userData.likes.push({
                category: "activity",
                type: activityType,
                number: 1
            });
        } else {
            account.userData.likes.type.findOneAndUpdate({ type: activityType }, {$inc: { Number: 1}});
        }

        await account.save();
    } catch (error) {
        return res.status(500).json({
            message: "Unable to access likes.",
            error: error.message
        });
    }
};

const likesByCuisine = async (req, res) => {
    try {
        const cuisine = req.params.cuisine;
        const account = await Account.findById(req.account.accountId);
        if (!account.userData) {
            account.userData = {};
        }
        if (!account.userData.likes) {
            account.userData.likes = [];
        }
        const like = account.userData.likes.type.findOne ({ type: cuisine});
        if (!like) {
            account.userData.likes.push({
                category: "cuisine",
                type: cuisine,
                number: 1
            });
        } else {
            account.userData.likes.type.findOneAndUpdate({ type: cuisine }, {$inc: { Number: 1}});
        }

        await account.save();
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
        const highestCategory = await account.userData.likes.category.find({}).sort({Number: -1}).limit(1);
        const highestType = account.userData.likes.type.find({}).sort({Number: -1}).limit(1);

        if (highestCategory == "activity") {
            const articles = await Article.find({ "activity.activityType": highestType });
        } else if (highestCategory == "meal") {
            const articles = await Article.find({ "meal.cuisine": highestType });
        }

        return res.status(200).json({
            message: "Highest likes retrieved successfully.",
            articles
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
    fetchLikesByType,
    createLikes,
    likesByActivity,
    likesByCuisine,
    fetchHighestLikes
}