const mongoose = require('mongoose');

const TableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true }, // 1, 2, 3
  name: { type: String, required: true }, // e.g. "Table 1 - 6×12 Championship"
  tableType: { type: String, default: '6x12' }, // 6x12, 5x10, PRIVATE_BILLIARD
  hourlyRate: { type: Number, default: 600 },
  perMinuteRate: { type: Number, default: 10 },
  rates: {
    ball15Single: { type: Number, default: 200 },
    ball15Double: { type: Number, default: 400 },
    ball10Single: { type: Number, default: 120 },
    ball10Double: { type: Number, default: 240 },
    ball06Single: { type: Number, default: 100 },
    ball06Double: { type: Number, default: 200 },
    billiardSingle: { type: Number, default: 50 },
    billiardDouble: { type: Number, default: 100 }
  },
  status: { 
    type: String, 
    enum: ['AVAILABLE', 'OCCUPIED', 'PAUSED', 'MAINTENANCE'],
    default: 'AVAILABLE' 
  },
  currentSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', default: null }
}, { timestamps: true });

module.exports = mongoose.models.Table || mongoose.model('Table', TableSchema);
