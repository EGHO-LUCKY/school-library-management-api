require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const authorRoute = require('./route/author');
const bookRoute = require('./route/book');

const app = express();
const MONGO_URI = process.env.MONGO_URI;

// REGISTER MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT TO MONGODB
main();
async function main () {
    await mongoose.connect(MONGO_URI);
    await console.log("Connected to MongoDB Successfully");
}

// REGISTER ROUTES
app.use('/', authorRoute);
app.use('/', bookRoute);

// ROUTE
app.get('/', (req, res) => {
    res.send("Welcome to the School Library Management API");
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})