const mongoose = require('mongoose');

const LikesSchema = mongoose.Schema({
    category: String,
    type: String,
    likes: Number
}, { timestamps: true });

const Likes = mongoose.model("wh_likes", LikesSchema);
module.exports = Likes;