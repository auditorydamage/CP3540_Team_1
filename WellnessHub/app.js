require("dotenv").config();
const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET;
// const wellnessRoute = require('./routes/wellnesshub.route');
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
// app.use('/api/wellnesshub', wellnessRoute);
const accountRoutes = require("./routes/account.routes");
app.use("/api/accounts", accountRoutes);
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