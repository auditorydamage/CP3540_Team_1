const express = require("express");
const likesRouter = express.Router();
const {fetchAllLikes, fetchLikesByCategory, fetchLikesByType, updateLikes, fetchHighestLikes} = require("../controllers/likes.controller");
const {verifyToken} = require("../middleware/auth.middleware");

likesRouter.get("/", verifyToken, fetchAllLikes);
likesRouter.get("/category/:category", verifyToken, fetchLikesByCategory);
likesRouter.get("/type/:type", verifyToken, fetchLikesByType);
likesRouter.get("/likes", verifyToken, fetchHighestLikes);
likesRouter.put("/", verifyToken, updateLikes);


module.exports = likesRouter;