const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    role: {
        type: String,
        enum: ["student", "instructor", "superInstructor", "superAdmin", "cvAdmin", "trackAdmin"],
        default: "student"
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    profilePic: {
        type: String,
        default: "https://www.gravatar.com/avatar/?d=mp"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    age: { type: Number },
    country: { type: String },
    gender: {
        type: String,
        enum: ["male", "female"]
    }
});


module.exports = mongoose.model("User", UserSchema);