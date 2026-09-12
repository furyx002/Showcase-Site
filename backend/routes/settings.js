const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// Default settings if not found in DB
const DEFAULT_SETTINGS = {
  whatsappNumber: '+923006255511',
  heroSliderImage1: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=2000',
  heroSliderImage2: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=2000'
};

// GET /api/settings - Fetch all global settings
router.get('/', async (req, res) => {
  try {
    const settingsList = await Setting.find({});
    
    // Convert array to object { key: value }
    const settings = { ...DEFAULT_SETTINGS };
    settingsList.forEach(setting => {
      settings[setting.key] = setting.value;
    });

    res.json({ success: true, data: settings });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/settings - Update settings (expects key-value pairs)
router.post('/', async (req, res) => {
  try {
    const updates = req.body;
    const keys = Object.keys(updates);
    
    for (const key of keys) {
      await Setting.findOneAndUpdate(
        { key },
        { value: updates[key] },
        { upsert: true, new: true }
      );
    }

    res.json({ success: true, message: 'Settings updated successfully' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;
