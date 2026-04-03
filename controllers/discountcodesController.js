const DiscountCode = require('../models/DiscountCode');

exports.getAllDiscountCodes = async (req, res) => {
  try {
    const codes = await DiscountCode.find();
    res.json(codes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createDiscountCode = async (req, res) => {
  try {
    const { code, discount, description } = req.body;
    const existing = await DiscountCode.findOne({ code });
    if (existing) return res.status(400).json({ message: 'Discount code already exists' });
    const discountCode = new DiscountCode({ code, discount, description });
    await discountCode.save();
    res.status(201).json(discountCode);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.applyDiscountCode = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ message: 'Code is required' });
    const discountCode = await DiscountCode.findOne({ code });
    if (!discountCode) return res.status(404).json({ message: 'Invalid discount code' });
    res.json({ code: discountCode.code, discount: discountCode.discount, description: discountCode.description });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDiscountCode = async (req, res) => {
  try {
    const code = await DiscountCode.findByIdAndDelete(req.params.id);
    if (!code) return res.status(404).json({ message: 'Discount code not found' });
    res.json({ message: 'Discount code deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
