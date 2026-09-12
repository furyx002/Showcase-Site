const express = require('express');
const router = express.Router();
const posService = require('../services/posService');

// GET /api/customers/next - Get next automated customer ID
router.get('/next', async (req, res) => {
  try {
    const custNo = await posService.generateCustomerNo();
    res.json({ success: true, customerNo: custNo, label: "Customer No: automated" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/customers/active - Get all active customer sessions across tables
router.get('/active', async (req, res) => {
  try {
    const tables = await posService.getTables();
    const activeCustomers = tables
      .filter(t => t.activeSession)
      .map(t => ({
        tableNumber: t.tableNumber,
        tableName: t.name,
        customerNo: t.activeSession.customerNo,
        customerName: t.activeSession.customerName,
        startTime: t.activeSession.startTime,
        startTimeFormatted: t.activeSession.startTimeFormatted,
        timeLimitMinutes: t.activeSession.timeLimitMinutes,
        isExpired: t.activeSession.isExpired,
        netElapsedSecs: t.activeSession.netElapsedSecs,
        tableCharge: t.activeSession.tableCharge,
        ordersTotal: t.activeSession.ordersTotal,
        grandTotal: t.activeSession.grandTotal,
        status: t.activeSession.status
      }));

    res.json({
      success: true,
      count: activeCustomers.length,
      data: activeCustomers
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
