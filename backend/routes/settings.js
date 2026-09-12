const express = require('express');
const router = express.Router();
const Setting = require('../models/Setting');

// Default settings if not found in DB
const DEFAULT_SETTINGS = {
  whatsappNumber: '+923006255511',
  heroSliders: ['/slider1.jpg', '/slider2.jpg'],
  marqueeEnabled: true,
  marqueeText: 'LIMITED TIME OFFER: ENJOY FREE SHIPPING NATIONWIDE ON ALL ORDERS THIS WEEK!'
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
    // Return default settings if DB fails
    res.json({ success: true, data: DEFAULT_SETTINGS, warning: err.message });
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
