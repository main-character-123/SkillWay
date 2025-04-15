const Testimonial = require("../Models/TestimonialModel");

exports.createTestimonial = async (req, res) => {
    try {
        const { testimonial, courseId } = req.body;
        const userId = req.user.id;

        if (!testimonial || !courseId) {
            return res.status(400).json({ success: false, message: "Testimonial and courseId are required." });
        }

        const newTestimonial = new Testimonial({ userId, testimonial, courseId });
        await newTestimonial.save();
        res.status(201).json({ success: true, message: "Testimonial added successfully.", testimonial: newTestimonial });
    } catch (error) {
        console.error("Error adding testimonial:", error);
        res.status(500).json({ success: false, message: "Failed to add testimonial." });
    }
};

exports.getAllTestimonials = async (req, res) => {
    try {
        const testimonials = await Testimonial.find()
            .populate("userId", "name profilePic") // Populate name and profilePic from User
            .populate("courseId", "name"); // Optionally populate course name
        res.json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not fetch testimonials." });
    }
};

exports.deleteTestimonial = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTestimonial = await Testimonial.findByIdAndDelete(id)
            .populate("userId", "name profilePic") // Populate name and profilePic from User
            .populate("courseId", "name"); // Optionally populate course name

        if (!deletedTestimonial) {
            return res.status(404).json({ success: false, message: "Testimonial not found." });
        }

        res.json({ success: true, message: "Testimonial deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting testimonial." });
    }
};

exports.getTestimonialsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        if (!courseId) {
            return res.status(400).json({ success: false, message: "Course ID is required." });
        }

        const testimonials = await Testimonial.find({ courseId })
            .populate("userId", "name profilePic") // Populate name and profilePic from User
            .populate("courseId", "name"); // Optionally populate course name
        res.json({ success: true, testimonials });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error fetching testimonials." });
    }
};