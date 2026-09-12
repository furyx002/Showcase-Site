const express = require('express');
const router = express.Router();
const posService = require('../services/posService');


// GET /api/tables - Fetch 3 tables status & active live timers
router.get('/', async (req, res) => {
  try {
    const tables = await posService.getTables();
    res.json({ success: true, data: tables });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/tables/:id/start - Start game timer with automated customer ID & poster rates
router.post('/:id/start', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const { customerName, timeLimitMinutes, billingMode, playerMode, ballType, fixedGameRate, perMinuteRate, hourlyRate } = req.body;
    const session = await posService.startSession({
      tableNumber,
      customerName,
      timeLimitMinutes,
      billingMode,
      playerMode,
      ballType,
      fixedGameRate,
      perMinuteRate,
      hourlyRate
    });
    res.json({ success: true, message: `Game started on Table ${tableNumber}`, data: session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// POST /api/tables/:id/pause - Pause game timer
router.post('/:id/pause', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const session = await posService.pauseSession(tableNumber);
    res.json({ success: true, message: `Table ${tableNumber} paused`, data: session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/tables/:id/resume - Resume game timer
router.post('/:id/resume', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const session = await posService.resumeSession(tableNumber);
    res.json({ success: true, message: `Table ${tableNumber} resumed`, data: session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/tables/:id/limit - Update session time limit (30m, 60m, etc.)
router.post('/:id/limit', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const { timeLimitMinutes } = req.body;
    const session = await posService.updateTimeLimit(tableNumber, timeLimitMinutes);
    res.json({ success: true, message: `Time limit updated for Table ${tableNumber}`, data: session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/tables/:id/add-item - Add snacks/drinks to active table session
router.post('/:id/add-item', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const item = req.body;
    const session = await posService.addItemToSession(tableNumber, item);
    res.json({ success: true, message: `Item added to Table ${tableNumber}`, data: session });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/tables/transfer - Transfer active session from source to target table
router.post('/transfer', async (req, res) => {
  try {
    const { fromTableNumber, toTableNumber } = req.body;
    const session = await posService.transferSession(fromTableNumber, toTableNumber);
    res.json({
      success: true,
      message: `Session transferred from Table ${fromTableNumber} to Table ${toTableNumber}`,
      data: session
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/tables/:id - Edit table configuration (name, hourly rate, per minute rate, poster rates)
router.put('/:id', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const { name, hourlyRate, perMinuteRate, rates } = req.body;
    const updated = await posService.updateTableConfig(tableNumber, { name, hourlyRate, perMinuteRate, rates });
    res.json({ success: true, message: `Table ${tableNumber} updated`, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});


// PUT /api/tables/:id/session - Edit active session details (customerName, startTime, timeLimitMinutes)
router.put('/:id/session', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const { customerName, startTime, timeLimitMinutes } = req.body;
    const updated = await posService.updateSessionDetails(tableNumber, { customerName, startTime, timeLimitMinutes });
    res.json({ success: true, message: `Session updated for Table ${tableNumber}`, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// PUT /api/tables/:id/item/:itemIndex - Edit or delete an attached bar item in active session tab
router.put('/:id/item/:itemIndex', async (req, res) => {
  try {
    const { id: tableNumber, itemIndex } = req.params;
    const { quantity } = req.body;
    const updated = await posService.updateSessionOrderItem(tableNumber, itemIndex, { quantity });
    res.json({ success: true, message: `Session bar tab updated`, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /api/tables/:id/checkout - End game, calculate final bill & printable receipt
router.post('/:id/checkout', async (req, res) => {
  try {
    const tableNumber = req.params.id;
    const { discount, paymentMethod } = req.body;
    const result = await posService.checkoutSession(tableNumber, { discount, paymentMethod });
    res.json({ success: true, message: `Table ${tableNumber} checked out successfully`, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

