const express = require('express');
const router = express.Router();
const posService = require('../services/posService');

// GET /api/products - Fetch bar & snacks catalog
router.get('/', async (req, res) => {
  try {
    const products = await posService.getProducts();
    res.json({ success: true, data: products });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/products - Add or update a product
router.post('/', async (req, res) => {
  try {
    const product = await posService.saveProduct(req.body);
    res.json({ success: true, data: product });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// DELETE /api/products/:id - Delete product from catalog
router.delete('/:id', async (req, res) => {
  try {
    await posService.deleteProduct(req.params.id);
    res.json({ success: true, message: 'Product deleted' });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

module.exports = router;

