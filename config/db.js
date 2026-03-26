const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;

module.exports = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB Successfully");
    } catch (err) {
        console.log(`Database connection failed. \nmessage: ${err.message}`);
        process.exit(1);
    }
}
