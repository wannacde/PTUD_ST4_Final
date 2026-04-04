const mongoose = require('mongoose');

const publisherSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  address: { type: String },
  phone: { type: String },
  email: { type: String },
  description: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Publisher', publisherSchema);
