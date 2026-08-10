const express = require("express");
const articleRouter = express.Router();
const {
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
} = require("../controllers/article.controller");

const {
    verifyToken
} = require("../middleware/auth.middleware");

articleRouter.get("/", verifyToken, fetchAllArticles);
articleRouter.get("/:id", verifyToken, fetchArticle);
articleRouter.get("/author/:author", verifyToken, fetchArticlesByAuthor);
articleRouter.get("/category/:category", verifyToken, fetchArticlesByCategory);
articleRouter.get("/activity/:activityType", verifyToken, fetchActivitiesByType);
articleRouter.get("/meal/:cuisine", verifyToken, fetchMealsByCuisine);

articleRouter.post("/", verifyToken, addArticle);
articleRouter.put("/:id", verifyToken, updateArticle);
articleRouter.put("/:id/publish", verifyToken, publishArticle);
articleRouter.put("/:id/unpublish", verifyToken, unpublishArticle);
articleRouter.delete("/:id", verifyToken, deleteArticle);

module.exports = articleRouter;