const mongoose = require('mongoose');
const { link } = require('../Routes/userRoutes');
const internships = new mongoose.Schema({
    place: {
        type: String,
        required: true
    },
    company: {
        type: String,
    },

    sponser: {
        type: String,
        required: true
    }
    ,
    salary: {
        type: String
    },
    duration: {
        type: String,
        required: true
    },
    keywords: {
        type: [String],
        required: true
    },
    image: {
        type: String
    },
    link: { type: String, required: true },
})
module.exports = mongoose.model('internships', internships)