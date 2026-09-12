const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
  span: {
    type: String,
    default: 'col-span-1 row-span-1',
  }
}, { timestamps: true });

module.exports = mongoose.model('Category', CategorySchema);
