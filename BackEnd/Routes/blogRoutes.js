const express = require('express');
const router = express.Router();
const blogController = require('../Controllers/blogController');
const { authMiddleware, allwedTo, allowedTo } = require('../Middlewares/authMiddleware');
const { imageUpload } = require('../Config/cloudinaryConfig');

router.get('/', blogController.getAllBlogs);
router.get('/:id', blogController.getBlogById);
router.post('/', authMiddleware, authMiddleware,
    allowedTo('superAdmin', 'superInstructor', 'instructor'), blogController.createBlog);
router.delete('/:id', authMiddleware, blogController.deleteBlog);
router.patch('/:id', authMiddleware, allowedTo('superAdmin', 'superInstructor', 'instructor'), blogController.updateBlog);

router.post('/:id/image', authMiddleware, allowedTo('superAdmin', 'superInstructor', 'instructor'), imageUpload.single('image'),
    blogController.addImageToBlog);


module.exports = router;    