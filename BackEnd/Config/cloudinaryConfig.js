const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
require('dotenv').config();

// Cloudinary Configuration
cloudinary.config({
  cloud_name: 'dvgsyjlmw',
  api_key: '752346759644142',
  api_secret: 'cWifB4c-hreQ2fS9QUTB1Mt7peQ',
});

const imageStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_photos',
    allowed_formats: ['jpeg', 'png', 'jpg'],
    resource_type: 'image',
  },
});

// Storage for Videos
const videoStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'user_videos',
    allowed_formats: ['mp4', 'avi', 'mov', 'mkv'],
    resource_type: 'video',
  },
});

const imageUpload = multer({ storage: imageStorage });
const videoUpload = multer({ storage: videoStorage });

module.exports = { cloudinary, imageUpload, videoUpload };