const express = require('express');
const router = express.Router();
const multer = require('multer');

// Use memory storage since Railway is ephemeral and frontend is on Vercel
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

router.post('/', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image uploaded' });
    }

    // Convert buffer to Base64
    const base64Image = req.file.buffer.toString('base64');
    const mimeType = req.file.mimetype;
    
    // Create data URI format that browsers can render in <img src="..." />
    const imageUrl = `data:${mimeType};base64,${base64Image}`;

    res.json({
      success: true,
      imageUrl: imageUrl
    });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ success: false, error: 'Failed to process image upload' });
  }
});

module.exports = router;
