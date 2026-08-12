const express = require("express");
const likesRouter = express.Router();
const {fetchAllLikes, fetchLikesByType, createLikes, likesByActivity, likesByCuisine, fetchHighestLikes} = require("../controllers/likes.controller");
const {verifyToken} = require("../middleware/auth.middleware");

likesRouter.get("/", verifyToken, fetchAllLikes);
likesRouter.get("/type/:type", verifyToken, fetchLikesByType);
likesRouter.get("/likes", verifyToken, fetchHighestLikes);
likesRouter.post("/", verifyToken, createLikes);

module.exports = likesRouter;