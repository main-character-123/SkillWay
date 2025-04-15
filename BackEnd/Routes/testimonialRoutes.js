const express = require("express");
const router = express.Router();
const testimonialController = require("../Controllers/testimonialController");
const { authMiddleware, allowedTo } = require("../Middlewares/authMiddleware");
router.get("/", testimonialController.getAllTestimonials);
router.post("/", authMiddleware, testimonialController.createTestimonial);
router.delete("/:id", authMiddleware, testimonialController.deleteTestimonial);
router.get("/course/:courseId", testimonialController.getTestimonialsByCourse);
module.exports = router;