const express = require("express");
const multer = require("multer");
const axios = require("axios");
const fs = require("fs");
const FormData = require("form-data");
const path = require("path");
const { authMiddleware, allowedTo } = require("../Middlewares/authMiddleware");

const router = express.Router();

// Multer configuration for temporary uploads
const upload = multer({ dest: "temp_uploads/" });

// Directory to save templates
const templatesDir = path.join(__dirname, "../Templates");

// Ensure the templates directory exists
if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
}

// Endpoint to upload a template
router.post("/upload-template", authMiddleware, allowedTo("superAdmin"), upload.single("template"), (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({ success: false, message: "No file uploaded." });
        }

        const targetPath = path.join(templatesDir, file.originalname);

        // Move the file to the templates directory
        fs.renameSync(file.path, targetPath);

        res.status(200).json({
            success: true,
            message: "Template uploaded successfully.",
            fileName: file.originalname,
        });
    } catch (error) {
        console.error("Error uploading template:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to upload template.",
        });
    }
});

// Endpoint to download a template
router.get("/download-template/:fileName", authMiddleware, allowedTo("superAdmin"), (req, res) => {
    try {
        const fileName = req.params.fileName;
        const filePath = path.join(templatesDir, fileName);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({ success: false, message: "Template not found." });
        }

        res.download(filePath, fileName, (err) => {
            if (err) {
                console.error("Error downloading template:", err.message);
                res.status(500).json({
                    success: false,
                    message: "Failed to download template.",
                });
            }
        });
    } catch (error) {
        console.error("Error downloading template:", error.message);
        res.status(500).json({
            success: false,
            message: "Failed to download template.",
        });
    }
});

router.post("/analyze-cv", upload.single("cv"), async (req, res) => {
    try {

        console.log("File uploaded:", req.file);

        const filePath = req.file.path;
        const originalName = req.file.originalname;
        const form = new FormData();

        form.append("cv", fs.createReadStream(filePath), originalName);


        console.log("Form Headers:", form.getHeaders());


        const contentLength = await new Promise((resolve, reject) => {
            form.getLength((err, length) => {
                if (err) reject(err);
                resolve(length);
            });
        });

        console.log("Form Headers with Content-Length:", form.getHeaders());
        console.log("Content-Length:", contentLength);


        const flaskResponse = await axios.post("http://127.0.0.1:5000/analyze_cv", form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': contentLength
            }
        });


        console.log("Flask Response:", flaskResponse.data);


        const rawAnalysis = flaskResponse.data;


        console.log("Raw Flask Analysis:", rawAnalysis);


        fs.unlinkSync(filePath);


        res.status(200).json({
            success: true,
            data: rawAnalysis
        });
        console.log("CV analysis successful:", rawAnalysis);

    } catch (error) {

        console.error("CV analysis failed:", error.response?.data || error.message);
        res.status(500).json({
            success: false,
            error: "CV processing failed."
        });
    }
});

module.exports = router;