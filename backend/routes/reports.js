const express = require('express');
const router = express.Router();
const posService = require('../services/posService');

// GET /api/reports/dashboard - Summary stats for POS header & dashboard
router.get('/dashboard', async (req, res) => {
  try {
    const stats = await posService.getDashboardStats();
    res.json({ success: true, data: stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
