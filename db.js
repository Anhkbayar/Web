const mongoose = require('mongoose');

const url = "mongodb://localhost:27017/Database";

const connect = () => {
    mongoose.connect(url)
        .then(() => console.log("MongoDB connected"))
        .catch(err => console.error("MongoDB connection error:", err));
}

module.exports = connect;
