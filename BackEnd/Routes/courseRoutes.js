const express = require("express");
const router = express.Router();
const courseController = require("../Controllers/courseController");
const { imageUpload, videoUpload } = require('../Config/cloudinaryConfig');
const { authMiddleware, allowedTo } = require("../Middlewares/authMiddleware");


router.get("/", courseController.getAllCourses);
router.get("/:id", courseController.getCourseById);
router.post("/", authMiddleware, allowedTo('superAdmin', 'instructor', 'superInstructor'), courseController.createCourse);
router.patch("/:id", authMiddleware, allowedTo('superAdmin', 'instructor', 'superInstructor'), courseController.updateCourse);
router.delete("/:id", courseController.deleteCourse);

router.post(
    '/:id',
    imageUpload.array('images', 3),
    courseController.addImage
);

router.post(
    '/:courseId/curriculum/:curriculumIndex/parts/:partIndex/demo',
    videoUpload.single('video'),
    courseController.addVideo
);

module.exports = router;