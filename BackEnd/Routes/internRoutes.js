const express = require('express');
const router = express.Router();
const internController = require('../Controllers/interController');
const { authMiddleware, allowedTo } = require('../Middlewares/authMiddleware');
const { imageUpload } = require('../Config/cloudinaryConfig');

router.get('/', internController.getAllInterns);
router.get('/:id', internController.getInternById);

router.post('/', authMiddleware, allowedTo('superAdmin', 'cvAdmin'), internController.createIntern);
router.delete('/:id', authMiddleware, internController.deleteIntern);
router.post(
    '/add-image/:id',
    authMiddleware, allowedTo('superAdmin', 'cvAdmin'),
    imageUpload.single('image'),
    internController.addImage
);

router.patch('/:id', authMiddleware, allowedTo('superAdmin', 'cvAdmin'), internController.updateIntern);

module.exports = router;
