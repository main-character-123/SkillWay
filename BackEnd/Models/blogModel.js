const mongoose = require("mongoose");

const blog = new mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    image: {
        type: String,
    },
    title: {
        type: String,
        required: true
    },
    date: {
        type: String,
    },
    duration: {
        type: String,
    },
    content: {
        type: String,
    }
})


module.exports = mongoose.model('blog', blog)