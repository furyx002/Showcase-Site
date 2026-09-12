const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, default: 'Club Administrator' },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['ADMIN', 'STAFF'], default: 'ADMIN' }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
