const mongoose = require('mongoose');

const ProductsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  inventory: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    trim: true
  },
  created: {
    type: Date,
    default: Date.now()
  }
});

module.exports = mongoose.model('Product', ProductsSchema);