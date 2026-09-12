const express = require('express');
const router = express.Router();
const authService = require('../services/authService');

// POST /api/auth/login - Authenticate user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.loginUser({ email, password });
    res.json({
      success: true,
      message: 'Login successful',
      data: result
    });
  } catch (err) {
    res.status(401).json({
      success: false,
      error: err.message || 'Login failed'
    });
  }
});

// GET /api/auth/me - Verify session token
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = authService.verifyToken(token);

  if (!decoded) {
    return res.status(401).json({ success: false, error: 'Invalid or expired session token' });
  }

  res.json({
    success: true,
    data: {
      email: decoded.email,
      role: decoded.role
    }
  });
});

module.exports = router;
