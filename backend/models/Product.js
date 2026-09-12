const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true }, // Drinks, Snacks, Accessories, Rentals
  price: { type: Number, required: true },
  stock: { type: Number, default: 100 },
  images: { type: [String], default: [] },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.models.Product || mongoose.model('Product', ProductSchema);
