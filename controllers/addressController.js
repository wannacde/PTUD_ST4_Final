const Address = require('../models/Address');

exports.getMyAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createAddress = async (req, res) => {
  try {
    const { fullName, phone, address, city, district, ward, isDefault } = req.body;
    if (!fullName || !phone || !address || !city || !district) {
      return res.status(400).json({ message: 'fullName, phone, address, city, district are required' });
    }
    if (isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    const newAddress = new Address({ user: req.user.id, fullName, phone, address, city, district, ward, isDefault: !!isDefault });
    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateAddress = async (req, res) => {
  try {
    const addr = await Address.findOne({ _id: req.params.id, user: req.user.id });
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    if (req.body.isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }
    Object.assign(addr, req.body);
    await addr.save();
    res.json(addr);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteAddress = async (req, res) => {
  try {
    const addr = await Address.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!addr) return res.status(404).json({ message: 'Address not found' });
    res.json({ message: 'Address deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
