const mongoose = require('mongoose');

const wishlistItemSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('WishlistItem', wishlistItemSchema);