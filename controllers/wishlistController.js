const WishlistItem = require('../models/WishlistItem');
const Book = require('../models/Book');

exports.getWishlist = async (req, res) => {
  try {
    const items = await WishlistItem.find({ user: req.user.id }).populate('book');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToWishlist = async (req, res) => {
  try {
    const { bookId } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    let item = await WishlistItem.findOne({ user: req.user.id, book: bookId });
    if (item) return res.status(400).json({ message: 'Book already in wishlist' });
    item = new WishlistItem({ user: req.user.id, book: bookId });
    await item.save();
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeFromWishlist = async (req, res) => {
  try {
    const item = await WishlistItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Wishlist item not found' });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
