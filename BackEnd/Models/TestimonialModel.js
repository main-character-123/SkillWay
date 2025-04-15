const mongoose = require("mongoose");

const testimonialSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    testimonial: { type: String, required: true, trim: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true }, // Reference to Course model
}, { timestamps: true });

module.exports = mongoose.model("Testimonial", testimonialSchema);