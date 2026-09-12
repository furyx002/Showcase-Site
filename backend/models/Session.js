const mongoose = require('mongoose');

const SessionOrderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  addedAt: { type: Date, default: Date.now }
});

const SessionSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  customerNo: { type: String, required: true }, // e.g. CUST-1001
  customerName: { type: String, default: 'Walk-in Customer' },
  startTime: { type: Date, default: Date.now },
  timeLimitMinutes: { type: Number, default: 0 }, // 0 = Unlimited
  pausedTotalSeconds: { type: Number, default: 0 },
  lastPausedAt: { type: Date, default: null },
  endTime: { type: Date, default: null },
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE'
  },
  
  // MM Snooker Club Billing Modes
  billingMode: { 
    type: String, 
    enum: ['PER_GAME', 'PER_MINUTE'], 
    default: 'PER_MINUTE' 
  },
  playerMode: { 
    type: String, 
    enum: ['SINGLE', 'DOUBLE'], 
    default: 'SINGLE' 
  },
  ballType: { 
    type: String, 
    enum: ['15_BALL', '10_BALL', '06_BALL', 'BILLIARD', 'CUSTOM_TIME'], 
    default: '15_BALL' 
  },
  fixedGameRate: { type: Number, default: 0 },
  perMinuteRate: { type: Number, default: 10 }, // e.g. Rs 10/min, 15/min, 18/min
  hourlyRate: { type: Number, default: 600 },   // e.g. Rs 1200/hr for private room

  orders: [SessionOrderItemSchema],
  tableCharge: { type: Number, default: 0 },
  ordersTotal: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  grandTotal: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'CASH' }
}, { timestamps: true });


module.exports = mongoose.models.Session || mongoose.model('Session', SessionSchema);
