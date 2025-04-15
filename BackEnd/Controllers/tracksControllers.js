const Track = require("../Models/trackModel");


const getAllTracks = async (req, res) => {
    try {
        const tracks = await Track.find();
        res.status(200).json({
            status: "success",
            results: tracks.length,
            data: { tracks },
        });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }
};

const addTrack = async (req, res) => {
    try {
        const { name, description, sections } = req.body;

        if (!Array.isArray(sections)) {
            return res.status(400).json({
                message: 'Sections must be an array',
            });
        }

        const isValidSections = sections.every((section) => {
            return (
                section.name && // Section should have a name
                Array.isArray(section.content) && // Content must be an array
                section.content.every(
                    (item) => item.title && item.link // Each content item should have title and link
                )
            );
        });

        if (!isValidSections) {
            return res.status(400).json({
                message: 'Each section must have a title, content, and each content item must have a title and link',
            });
        }

        // Create and save the new track
        const newTrack = new Track({
            name,
            description,
            sections,
        });

        const savedTrack = await newTrack.save();

        res.status(201).json({
            message: 'Track added successfully',
            track: savedTrack,
        });
    } catch (error) {
        res.status(500).json({
            message: 'Failed to add track',
            error: error.message,
        });
    }
};

const deleteTrack = async (req, res) => {
    try {
        await Track.findByIdAndDelete(req.params.id);
        res.status(200).json({
            status: "success",
            data: "Track deleted successfully",
        });
    } catch (err) {
        res.status(404).json({ status: "fail", message: err });
    }
};
// In Controllers/tracksControllers.js
const getTrackById = async (req, res) => {
  try {
    const track = await Track.findById(req.params.id);
    if (!track) {
      return res.status(404).json({ message: "Track not found" });
    }
    res.status(200).json(track);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { getAllTracks, addTrack, deleteTrack , getTrackById};
