const mongoose = require('mongoose');

const discountCodeSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discount: { type: Number, required: true }, // percent or amount
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DiscountCode', discountCodeSchema);