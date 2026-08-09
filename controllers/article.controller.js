const Account = require("../models/account.model");
const Article = require("../models/article.model");
const jwt = require("jsonwebtoken");

const likes = [];

const fetchArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: "Article not found."
            });
        }
        
        return res.status(200).json({
            message: "Article fetched successfully.",
            article
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch article.",
            error: error.message
        });
    }
}

const fetchAllArticles = async (req, res) => {
    try {
        const articles = await Article.find();
        if (!articles || articles.length === 0) {
            return res.status(404).json({
                message: "No articles found."
            });
        }

        return res.status(200).json({
            message: "Articles fetched successfully.",
            articles
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch articles.",
            error: error.message
        });
    }
}

const fetchArticlesByAuthor = async (req, res) => {
    try {
        const author = req.params.author;
        const articles = await Article.find({ author });
        if (!articles || articles.length === 0) {
            return res.status(404).json({
                message: "No articles found for the specified author."
            });
        }

        return res.status(200).json({
            message: "Articles fetched successfully.",
            articles
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch articles.",
            error: error.message
        });
    }
};

const fetchArticlesByCategory = async (req, res) => {
    try {
        const category = req.params.category;
        const articles = await Article.find({ category });
        if (!articles || articles.length === 0) {
            return res.status(404).json({
                message: "No articles found for the specified category."
            });
        }

        return res.status(200).json({
            message: "Articles fetched successfully.",
            articles
        });

    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch articles.",
            error: error.message
        });
    }
};

const fetchActivitiesByType = async (req, res) => {
    try {
        const activityType = req.params.activityType;
        const articles = await Article.find({ "activity.activityType": activityType });

        if (!articles || articles.length === 0) {
            return res.status(404).json({
                message: "No activities found for the specified type."
            });
        }

        return res.status(200).json({
            message: "Activities fetched successfully.",
            articles
        });

        const findActivity = likes.includes(activityType);
        if (!findActivity) {
            const obj = {
                category: "activity",
                type: activityType,
                likes: 1
            };
            likes.push(obj);
        } else {
             const index = likes.findIndex(function (like) {
                return like.type === activityType;
             });
             likes[index][2] += 1;
        }

    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch activities.",
            error: error.message
        });
    }
};

const fetchMealsByCuisine = async (req, res) => {
    try {
        const cuisine = req.params.cuisine;
        const articles = await Article.find({ "meal.cuisine": cuisine });

        if (!articles || articles.length === 0) {
            return res.status(404).json({
                message: "No meals found for the specified cuisine."
            });
        }

        return res.status(200).json({
            message: "Meals fetched successfully.",
            articles
        });

        const findCuisine = likes.includes(cuisine);
        if (!findCuisine) {
            const obj = {
                category: "meal",
                type: cuisine,
                likes: 1
            };
            likes.push(obj);
        } else {
            const index = likes.findIndex(function (like) {
                return like.type === cuisine;
             });
             likes[index][2] += 1;
        }

    } catch (error) {
        return res.status(500).json({
            message: "Unable to fetch meals.",
            error: error.message
        });
    }
};

const addArticle = async (req, res) => {
    try {
        const article = await new Article(req.body);
        await article.save();
        return res.status(201).json({
            message: "Article added successfully.",
            article
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to add article.",
            error: error.message
        });
    }
};

const updateArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, req.body);
        if (!article) {
            return res.status(404).json({
                message: "Article not found."
            });
        }

        return res.status(200).json({
            message: "Article updated successfully.",
            article
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to update article.",
            error: error.message
        });
    }
};

const publishArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, { isPublished: true });
        if (!article) {
            return res.status(404).json({
                message: "Article not found."
            });
        }

        return res.status(200).json({
            message: "Article published successfully.",
            article
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to publish article.",
            error: error.message
        });
    }
};

const unpublishArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndUpdate(req.params.id, { isPublished: false });
        if (!article) {
            return res.status(404).json({
                message: "Article not found."
            });
        }

        return res.status(200).json({
            message: "Article unpublished successfully.",
            article
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to unpublish article.",
            error: error.message
        });
    }
};

const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findByIdAndDelete(req.params.id);
        if (!article) {
            return res.status(404).json({
                message: "Article not found."
            });
        }

        return res.status(200).json({
            message: "Article deleted successfully.",
            article
        });
    } catch (error) {
        return res.status(500).json({
            message: "Unable to delete article.",
            error: error.message
        });
    }
};

module.exports = {
    fetchArticle,
    fetchAllArticles,
    fetchArticlesByCategory,
    fetchArticlesByAuthor,
    fetchActivitiesByType,
    fetchMealsByCuisine,
    addArticle,
    updateArticle,
    publishArticle,
    unpublishArticle,
    deleteArticle
}