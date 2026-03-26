require('dotenv').config();
const express = require('express');
const authorRoute = require('./routes/authorRoute');
const bookRoute = require('./routes/bookRoute');
const studentRoute = require('./routes/studentRoute');
const attendantRoute = require('./routes/libraryAttendantRoute');

// INITIALIZE EXPRESS APP
const app = express();

// REGISTER MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CONNECT TO MONGODB
const connectDB = require('./config/db');
connectDB();

// REGISTER ROUTES
app.use('/authors', authorRoute);
app.use('/books', bookRoute);
app.use('/students', studentRoute);
app.use('/attendants', attendantRoute);

// ROUTE
app.get('/', (req, res) => {
    res.send("Welcome to the School Library Management API");
});

// HANDLES UNDEFINED ROUTES
app.use((req, res) => {
    res.status(404).send("This route is not available");
});

// SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running at PORT ${PORT}`);
})