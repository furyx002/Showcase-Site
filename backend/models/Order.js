const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
  productId: { type: String },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 }
});

const OrderSchema = new mongoose.Schema({
  orderNo: { type: String, required: true, unique: true }, // e.g. ORD-1001
  customerNo: { type: String, required: true }, // Automated CUST-XXXX
  customerName: { type: String, default: 'Counter Customer' },
  type: { type: String, enum: ['DIRECT_POS', 'TABLE_SESSION'], default: 'DIRECT_POS' },
  tableNumber: { type: Number, default: null },
  sessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null },
  items: [OrderItemSchema],
  subtotal: { type: Number, required: true },
  tax: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['CASH', 'CARD', 'ONLINE', 'SPLIT'], default: 'CASH' },
  status: { type: String, enum: ['PAID', 'REFUNDED'], default: 'PAID' }
}, { timestamps: true });

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
