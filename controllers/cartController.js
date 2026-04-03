const CartItem = require('../models/CartItem');
const Book = require('../models/Book');

exports.getCart = async (req, res) => {
  try {
    const items = await CartItem.find({ user: req.user.id }).populate('book');
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const { bookId, quantity } = req.body;
    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });
    let item = await CartItem.findOne({ user: req.user.id, book: bookId });
    if (item) {
      item.quantity += quantity;
      await item.save();
    } else {
      item = new CartItem({ user: req.user.id, book: bookId, quantity });
      await item.save();
    }
    res.status(201).json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const item = await CartItem.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { quantity },
      { new: true }
    );
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const item = await CartItem.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!item) return res.status(404).json({ message: 'Cart item not found' });
    res.json({ message: 'Item removed' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ user: req.user.id });
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
