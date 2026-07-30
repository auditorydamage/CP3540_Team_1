const express = require("express");
const articleRouter = express.Router();
const {fetchArticle, fetchAllArticles, fetchArticlesByCategory, fetchArticlesByAuthor, fetchActivitiesByType, 
    fetchMealsByCuisine, addArticle, updateArticle, publishArticle, unpublishArticle, deleteArticle} = require("../controllers/article.controller");

articleRouter.get("/", fetchAllArticles);
articleRouter.get("/:id", fetchArticle);
articleRouter.get("/author/:author", fetchArticlesByAuthor);
articleRouter.get("/category/:category", fetchArticlesByCategory);
articleRouter.get("/activity/:activityType", fetchActivitiesByType);
articleRouter.get("/meal/:cuisine", fetchMealsByCuisine);

articleRouter.post("/", addArticle);
articleRouter.put("/:id", updateArticle);
articleRouter.put("/:id/publish", publishArticle);
articleRouter.put("/:id/unpublish", unpublishArticle);
articleRouter.delete("/:id", deleteArticle);

module.exports = articleRouter;