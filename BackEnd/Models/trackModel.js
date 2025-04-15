const mongoose = require('mongoose');
const sectionSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    content: [{
        title: { type: String, required: true },
        link: { type: String, required: true },
    }]
});

const trackSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    description: { type: String, required: true, trim: true },
    sections: [sectionSchema],
});

module.exports = mongoose.model('track', trackSchema);