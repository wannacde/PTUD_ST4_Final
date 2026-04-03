const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const DiscountCode = require('../models/DiscountCode');

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.book');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate('items.book').populate('user', 'username email');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.placeOrder = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ user: req.user.id }).populate('book');
    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

    let total = 0;
    const items = cartItems.map(item => {
      total += item.book.price * item.quantity;
      return { book: item.book._id, quantity: item.quantity, price: item.book.price };
    });

    let discount = 0;
    let appliedCode = null;

    const { discountCode } = req.body;
    if (discountCode) {
      const code = await DiscountCode.findOne({ code: discountCode });
      if (!code) return res.status(400).json({ message: 'Invalid discount code' });
      discount = code.discount;
      appliedCode = code.code;
      total = Math.max(0, total - (total * discount / 100));
    }

    const order = new Order({ user: req.user.id, items, total, discount, discountCode: appliedCode, status: 'pending' });
    await order.save();
    await CartItem.deleteMany({ user: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(req.params.id, { status, updatedAt: Date.now() }, { new: true });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
