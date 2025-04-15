const mongoose = require("mongoose");
const curriculumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    parts: [
        {
            title: { type: String, required: true },
            duration: { type: String, required: true },
            numbering: { type: String, required: true },
            demoVideo: { type: String, required: true },
            description: { type: String, required: true }

        }
    ]
});

const courseSchema = new mongoose.Schema({
    instructorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    duration: { type: String, required: true, trim: true },
    level: { type: String, required: true, enum: ["Beginner", "Intermediate", "Advanced"] },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to User model
    images: [{ type: String }],
    curriculum: [curriculumSchema],
}, { timestamps: true });

module.exports = mongoose.model("Course", courseSchema);