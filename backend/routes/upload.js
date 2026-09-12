const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Set up Multer storage to save files to frontend/public/uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Relative to backend directory, resolve to frontend public/uploads
    cb(null, path.join(__dirname, '../../frontend/public/uploads'));
  },
  filename: function (req, file, cb) {
    // Append timestamp to filename to prevent collisions
    const ext = path.extname(file.originalname);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    // The frontend can serve files from the public directory directly via /uploads/filename
    const imageUrl = `/uploads/${req.file.filename}`;

    res.json({
      success: true,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
});

module.exports = router;
