const express = require('express');
const router = express.Router();
const posService = require('../services/posService');

// GET /api/orders - Fetch transaction history
router.get('/', async (req, res) => {
  try {
    const orders = await posService.getOrders();
    res.json({ success: true, data: orders });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/orders/direct - Create direct bar sale with automated customer ID
router.post('/direct', async (req, res) => {
  try {
    const { items, customerName, discount, paymentMethod } = req.body;
    if (!items || !items.length) {
      return res.status(400).json({ success: false, error: 'Cart items are required' });
    }
    const order = await posService.createDirectOrder({ items, customerName, discount, paymentMethod });
    res.json({ success: true, message: 'Bar sale completed', data: order });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/orders/:id - Delete sales record
router.delete('/:id', async (req, res) => {
  try {
    await posService.deleteOrder(req.params.id);
    res.json({ success: true, message: 'Transaction deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
