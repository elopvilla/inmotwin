const mongoose = require('mongoose');
const config = require('./config');
const db = config.credentials.mongo_uri;

const connectDB = async () => {
    try {
        await mongoose.connect(db, {
            useNewUrlParser: true
        }),
        console.log("Connected to MongoDB")
    } catch (err){
        console.error(err);
        process.exit(1);
    }
};

module.exports = connectDB