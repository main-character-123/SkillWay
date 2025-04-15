const Blog = require("../Models/blogModel");
const mongoose = require('mongoose');

exports.getAllBlogs = async (req, res) => {
    try {
        const Blogs = await Blog.find().populate('author', 'name'); // Populate author's name
        res.json({ success: true, Blogs });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not fetch Blogs' });
    }
};

exports.getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'name'); // Populate author's name
        if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
        res.json({ success: true, blog });
    } catch (error) {
        console.error('Error retrieving Blog:', error);
        res.status(500).json({ success: false, message: 'Error retrieving Blog' });
    }
};

exports.createBlog = async (req, res) => {
    try {
        const { title, date, content, duration } = req.body;
        const instructorId = req.user.id;

        if (!title || !date || !content || !duration) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        const newBlog = new Blog({
            author: instructorId, // Store user ID as the author
            title,
            date,
            content,
            duration
        });

        await newBlog.save();

        res.status(201).json({
            success: true,
            message: 'Blog created successfully.',
            blog: newBlog
        });
    } catch (error) {
        console.error('Error creating Blog:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create Blog. Please try again.'
        });
    }
};

exports.addImageToBlog = async (req, res) => {
    try {
        const blogId = req.params.id;

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'Image file is required.'
            });
        }
        const imageUrl = req.file.path;

        const blog = await Blog.findById(blogId).populate('author', 'name'); // Populate author's name
        if (!blog) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found.'
            });
        }

        blog.image = imageUrl;
        await blog.save();

        res.json({
            success: true,
            message: 'Image added to Blog successfully.',
            blog
        });
    } catch (error) {
        console.error('Error adding image to Blog:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to add image to Blog. Please try again.'
        });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedBlog = await Blog.findByIdAndDelete(id).populate('author', 'name'); // Populate author's name
        if (!deletedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }
        res.json({ success: true, message: 'Blog deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting Blog.' });
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const id = req.params.id;
        const { image, title, date, content, duration } = req.body;
        const instructorId = req.user.id;

        const existingBlog = await Blog.findById(id).populate('author', 'name'); // Populate author's name
        if (!existingBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }

        if (!req.user.role || !existingBlog.author) {
            return res.status(403).json({ success: false, message: "Authorization data missing." });
        }

        if (req.user.role !== 'superAdmin' && req.user.role !== 'superInstructor' && existingBlog.author._id.toString() !== instructorId.toString()) {
            return res.status(403).json({ success: false, message: "Not authorized to update this blog." });
        }

        const newdata = { image, title, date, content, duration };

        const updatedBlog = await Blog.findByIdAndUpdate(id, newdata, { new: true }).populate('author', 'name'); // Populate author's name
        if (!updatedBlog) {
            return res.status(404).json({ success: false, message: 'Blog not found.' });
        }
        res.json({ success: true, message: 'Blog updated successfully.', blog: updatedBlog });
    } catch (error) {
        console.error('Error updating Blog:', error.stack);
        res.status(500).json({ success: false, message: 'An unexpected error occurred while updating the blog.' });
    }
};