const Course = require("../Models/CourseModel");
const mongoose = require("mongoose");

const validateCourse = (data) => {
    const errors = [];
    if (!data.name) errors.push("Course name is required.");
    if (!data.description) errors.push("Course description is required.");
    if (!data.duration) errors.push("Course duration is required.");
    if (!data.level) errors.push("Course level is required.");
    if (!["Beginner", "Intermediate", "Advanced"].includes(data.level)) {
        errors.push("Course level must be Beginner, Intermediate, or Advanced.");
    }

    return errors;
};

exports.createCourse = async (req, res) => {
    try {
        const instructorId = req.user.id;
        console.log(instructorId);
        const courseData = { ...req.body, instructorId, author: instructorId };

        const errors = validateCourse(req.body);
        if (errors.length > 0) {
            return res.status(400).json({ success: false, errors });
        }

        const newCourse = new Course(courseData);
        await newCourse.save();
        res.status(201).json({ success: true, message: "Course created successfully.", course: newCourse });
    } catch (error) {
        console.error("Error creating course:", error);
        res.status(500).json({ success: false, message: "Failed to create course. Please try again." });
    }
};

exports.getAllCourses = async (req, res) => {
    console.log("📥 [GET] /courses called");

    try {
        const courses = await Course.find().populate("author", "name"); // Populate author's name
        res.json({ success: true, courses });
    } catch (error) {
        res.status(500).json({ success: false, message: "Could not fetch courses." });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate("author", "name"); // Populate author's name
        if (!course) return res.status(404).json({ success: false, message: "Course not found." });

        res.json({ success: true, course });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error retrieving course." });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const existingCourse = await Course.findById(req.params.id).populate("author", "name"); // Populate author's name
        if (!existingCourse) {
            return res.status(404).json({ success: false, message: "Course not found." });
        }

        if (req.user.role !== 'superAdmin' && req.user.role !== 'superInstructor' && existingCourse.author._id.toString() !== req.user.id.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this course." });
        }

        const course = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate("author", "name"); // Populate author's name

        res.status(200).json({ success: true, message: "Course updated successfully.", course });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating course." });
        console.error("Error updating course:", error);
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        const id = req.params.id;

        // Delete the course
        const course = await Course.findByIdAndDelete(id).populate("author", "name"); // Populate author's name
        if (!course) return res.status(404).json({ success: false, message: "Course not found." });

        await mongoose.model("Testimonial").deleteMany({ courseId: id });

        res.json({ success: true, message: "Course and related testimonials deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting course and related testimonials." });
    }
};

exports.addVideo = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No video uploaded' });
        }
        const video_url = req.file.path;
        const result = await addDemoVideo(req.params.courseId, req.params.curriculumIndex, req.params.partIndex, video_url);
        if (!result.success) {
            return res.status(404).json({ success: false, message: result.message });
        }
        res.status(200).json({ success: true, message: result.message, course: result.course });
    } catch (error) {
        console.error('Video Upload Error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const addDemoVideo = async (courseId, curriculumIndex, partIndex, video_url) => {
    try {
        const course = await mongoose.model("Course").findById(courseId).populate("author", "name"); // Populate author's name
        if (!course) {
            return { success: false, message: "Course not found" };
        }
        if (!course.curriculum[curriculumIndex] || !course.curriculum[curriculumIndex].parts[partIndex]) {
            return { success: false, message: "Part not found in curriculum" };
        }
        course.curriculum[curriculumIndex].parts[partIndex].demoVideo = video_url;
        await course.save();
        return { success: true, message: "Demo video added successfully", course };
    } catch (error) {
        console.error("Error adding demo video:", error);
        return { success: false, message: "Server error", error };
    }
};

exports.addImage = async (req, res) => {
    try {
        const courseId = req.params.id;
        const files = req.files; // .array('images') multer

        if (!files || files.length === 0) {
            return res.status(400).json({ success: false, message: "No photos uploaded" });
        }

        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ success: false, message: "Invalid course ID format" });
        }

        const course = await Course.findById(courseId).populate("author", "name"); // Populate author's name
        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        // Initialize image array if not present
        if (!Array.isArray(course.images)) {
            course.images = [];
        }

        // Add each image, keeping a max of 3
        for (const file of files) {
            course.images.push(file.path);

            // If more than 3, remove oldest
            if (course.images.length > 3) {
                const removedImage = course.images.shift();
            }
        }

        const updatedCourse = await course.save();

        res.status(200).json({
            success: true,
            message: "Photos uploaded successfully",
            course: updatedCourse
        });

    } catch (error) {
        console.error("Error uploading photos:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};