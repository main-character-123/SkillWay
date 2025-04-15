

const Intern = require("../Models/internshipsModel")
const mongoose = require('mongoose');

exports.getAllInterns = async (req, res) => {
    try {
        const interns = await Intern.find();
        res.json({ success: true, interns });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Could not fetch interns' });
    }
}
exports.getInternById = async (req, res) => {
    try {
        const inter = await Intern.findById(req.params.id);
        if (!inter) return res.status(404).json({ success: false, message: 'Intern not found' });
        res.json({ success: true, inter });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error retrieving intern' });
    }
}
exports.createIntern = async (req, res) => {
    try {
        const { keywords, sponser, company, salary, place, duration, description, link } = req.body;

        if (!keywords || !sponser || !company || !place || !salary || !duration || !link) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required.'
            });
        }

        const newintern = new Intern({ keywords, sponser, company, place, salary, duration, link });
        await newintern.save();

        res.status(201).json({
            success: true,
            message: 'Intern created successfully.',
            intern: newintern
        });

    } catch (error) {
        console.error('Error creating intern:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create intern. Please try again.'
        });
    }
};

exports.deleteIntern = async (req, res) => {
    try {
        const id = req.params.id;
        const deletedIntern = await Intern.findByIdAndDelete(id);
        if (!deletedIntern) {
            return res.status(404).json({ success: false, message: 'Intern not found.' });
        }
        res.json({ success: true, message: 'Intern deleted successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting intern.' });
    }
}

exports.updateIntern = async (req, res) => {
    try {
        const id = req.params.id;
        const { image, keywords, sponser, company, place, salary, duration, link } = req.body;
        const newdata = { image, keywords, sponser, company, place, salary, duration, link };
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Intern ID format.' });
        }
        const updatedIntern = await Intern.findByIdAndUpdate(id, newdata, { new: true });
        if (!updatedIntern) {
            return res.status(404).json({ success: false, message: 'Intern not found.' });
        }
        res.json({ success: true, message: 'Intern updated successfully.', intern: updatedIntern });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating intern.' });
    }
}


exports.addImage = async (req, res) => {
    try {
        const id = req.params.id;
        const image = req.file.path;
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ success: false, message: 'Invalid Intern ID format.' });
        }
        const updatedIntern = await Intern.findByIdAndUpdate(id, { image }, { new: true });
        if (!updatedIntern) {
            return res.status(404).json({ success: false, message: 'Intern not found.' });
        }
        res.json({ success: true, message: 'Image added successfully.', intern: updatedIntern });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error adding image.' });
    }
}