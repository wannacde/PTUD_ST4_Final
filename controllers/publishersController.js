const Publisher = require('../models/Publisher');

exports.getAllPublishers = async (req, res) => {
  try {
    const publishers = await Publisher.find().sort({ name: 1 });
    res.json(publishers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublisherById = async (req, res) => {
  try {
    const publisher = await Publisher.findById(req.params.id);
    if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
    res.json(publisher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createPublisher = async (req, res) => {
  try {
    const { name, address, phone, email, description } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const publisher = new Publisher({ name, address, phone, email, description });
    await publisher.save();
    res.status(201).json(publisher);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Publisher name already exists' });
    res.status(500).json({ message: err.message });
  }
};

exports.updatePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
    res.json(publisher);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deletePublisher = async (req, res) => {
  try {
    const publisher = await Publisher.findByIdAndDelete(req.params.id);
    if (!publisher) return res.status(404).json({ message: 'Publisher not found' });
    res.json({ message: 'Publisher deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
