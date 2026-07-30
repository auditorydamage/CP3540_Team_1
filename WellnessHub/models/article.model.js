const mongoose = require('mongoose');

const ActivitySubSchema = mongoose.Schema({
    activityType: String,
    body: String
});

const MealSubSchema = mongoose.Schema({
    name: String,
    cuisine: String,
    mealType: String,
    body: String,
    ingredients: [String]
});

const ArticleSchema = mongoose.Schema({
    author: String,
    title: String,
    category: {
        type: String,
        enum: ["activity", "meal"]
    },
    activity: ActivitySubSchema,
    meal: MealSubSchema,
    isPublished: Boolean
}, { timestamps: true });

const Article = mongoose.model("wh_article", ArticleSchema);
module.exports = Article;