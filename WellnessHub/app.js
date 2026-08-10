const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
const accountRoutes = require("./routes/account.routes");
const articleRoutes = require("./routes/article.routes");
const waterRoutes = require("./routes/water.routes");
const moodRoutes = require("./routes/mood.routes");
const walkingRoutes = require("./routes/walking.routes");
const heartrateRoutes = require("./routes/heartrate.routes");
const sleepRoutes = require("./routes/sleep.routes");
const weightRoutes = require("./routes/weight.routes");
const mealPlanRoutes = require("./routes/mealplan.routes");
const activityRoutes = require("./routes/activity.routes");

app.use("/api/mood", moodRoutes);
app.use("/api/walking", walkingRoutes);
app.use("/api/heartrate", heartrateRoutes);
app.use("/api/sleep", sleepRoutes);
app.use("/api/activities", activityRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/accounts", accountRoutes);
app.use("/api/water", waterRoutes);
app.use("/api/weight", weightRoutes);
app.use("/api/mealplans", mealPlanRoutes);


// test GET
app.get('/', (req, res) => {
  res.send('GET works!');
});

// test POST
app.post('/', (req, res) => {
  res.send('POST works!');
});

mongoose.connect('mongodb+srv://markphoenix06_db_user:Password1@home.2funf.mongodb.net/?appName=home', { dbName: 'wellnesshub' })
    .then(() => {
        console.log("Connected to the database.");
        app.listen(port, () => {
            console.log(`WellnessHub listening on port ${port}`);
        });
    })
    .catch((error) => {
    console.log("Failed to connect to the database.");
    console.error(error.message);
});