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
    verifyToken,
    authorizeRoles
} = require("../middleware/auth.middleware");

// Any authenticated account can read articles
articleRouter.get("/", verifyToken, fetchAllArticles);
articleRouter.get("/author/:author", verifyToken, fetchArticlesByAuthor);
articleRouter.get("/category/:category", verifyToken, fetchArticlesByCategory);
articleRouter.get("/activity/:activityType", verifyToken, fetchActivitiesByType);
articleRouter.get("/meal/:cuisine", verifyToken, fetchMealsByCuisine);
articleRouter.get("/:id", verifyToken, fetchArticle);

// Only providers and admins can manage articles
articleRouter.post(
    "/",
    verifyToken,
    authorizeRoles("provider", "admin"),
    addArticle
);

articleRouter.put(
    "/:id",
    verifyToken,
    authorizeRoles("provider", "admin"),
    updateArticle
);

articleRouter.put(
    "/:id/publish",
    verifyToken,
    authorizeRoles("provider", "admin"),
    publishArticle
);

articleRouter.put(
    "/:id/unpublish",
    verifyToken,
    authorizeRoles("provider", "admin"),
    unpublishArticle
);

articleRouter.delete(
    "/:id",
    verifyToken,
    authorizeRoles("provider", "admin"),
    deleteArticle
);

module.exports = articleRouter;