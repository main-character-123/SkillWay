const express = require('express');
const router = express.Router();

const userController = require('../Controllers/userContrtoller');
const authController = require('../Controllers/authController');
const { authMiddleware, allowedTo } = require('../Middlewares/authMiddleware');
const { imageUpload } = require('../Config/cloudinaryConfig');
router.post('/signUp', authController.addUser);
router.post('/signIn', authController.login);

router.post('/role/:id', authMiddleware, allowedTo('superAdmin'), userController.addRole);

router.get('/check-auth', authMiddleware, userController.checkAuth);

router.post('/check-password', authMiddleware, userController.checkPassword);

router.get('/', authMiddleware, allowedTo('superAdmin'), userController.getAllUsers);
router.get('/getStudents', authMiddleware, allowedTo('superAdmin'),
  userController.getStudents);
router.get('/getInstructors', authMiddleware, allowedTo('superAdmin'),
  userController.getInstructors);
router.get('/:id', authMiddleware, allowedTo('superAdmin'),
  userController.getUser);

router.delete('/:id', authMiddleware, allowedTo('superAdmin'), userController.deleteUser);
router.patch('/update-user/:id', authMiddleware, userController.updateUser);

router.patch('/update-password', authMiddleware, userController.updatePassword);

router.patch(
  '/update-image/:id',
  imageUpload.single('photo'),
  userController.addImage
);

module.exports = router;