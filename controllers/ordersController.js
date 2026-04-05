const Order = require('../models/Order');
const CartItem = require('../models/CartItem');
const DiscountCode = require('../models/DiscountCode');
const Notification = require('../models/Notification');
const Book = require('../models/Book');

const STATUS_LABELS = {
  pending: 'Cho xac nhan',
  paid: 'Da thanh toan',
  shipped: 'Dang giao',
  completed: 'Hoan thanh',
  cancelled: 'Da huy'
};

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

    await Notification.create({
      user: req.user.id,
      title: 'Dat hang thanh cong',
      message: `Don hang #${order._id.toString().slice(-6).toUpperCase()} da duoc tao thanh cong. Trang thai hien tai: ${STATUS_LABELS.pending}.`,
      type: 'order'
    });

    await CartItem.deleteMany({ user: req.user.id });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    const previousStatus = order.status;

    if (status === 'paid' && !order.inventoryDeducted) {
      const bookIds = order.items.map((item) => item.book);
      const books = await Book.find({ _id: { $in: bookIds } });
      const booksById = new Map(books.map((book) => [book._id.toString(), book]));

      for (const item of order.items) {
        const book = booksById.get(item.book.toString());
        if (!book) {
          return res.status(404).json({ message: 'Book in order not found' });
        }
        if (book.stock < item.quantity) {
          return res.status(400).json({
            message: `Not enough stock for ${book.title}. Remaining: ${book.stock}, required: ${item.quantity}`
          });
        }
      }

      for (const item of order.items) {
        const book = booksById.get(item.book.toString());
        book.stock -= item.quantity;
        await book.save();
      }

      order.inventoryDeducted = true;
    }

    order.status = status;
    order.updatedAt = Date.now();
    await order.save();

    if (previousStatus !== status) {
      await Notification.create({
        user: order.user,
        title: 'Cap nhat trang thai don hang',
        message: `Don hang #${order._id.toString().slice(-6).toUpperCase()} da duoc cap nhat sang trang thai: ${STATUS_LABELS[status] || status}.`,
        type: 'order'
      });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
