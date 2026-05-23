const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Card Schema
const CardSchema = new mongoose.Schema({
  name: String,
  role: String,
  department: String,
  avatar: String, // base64 string
  cover: String,  // base64 string
  phone: String,
  email: String,
  password: String,
  // add other member fields as needed
});

const Card = mongoose.model('Card', CardSchema);

// Create a new card
router.post('/create', async (req, res) => {
  try {
    const card = new Card(req.body);
    await card.save();
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// List all cards (for admin)
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({}).lean();
    res.json({ success: true, cards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Update an existing card
router.put('/update/:id', async (req, res) => {
  try {
    const updated = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, card: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get card by ID (password not required for basic info)
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find({}).lean();
    res.json({ success: true, cards });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Delete card by ID
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Card.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Get a card by its Mongo ObjectId
router.get('/get/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).lean();
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
    const { password, ...rest } = card; // exclude password
    res.json({ success: true, card: rest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});
// Unlock card by ID and password (for view.html)
router.post('/unlock/:id', async (req, res) => {
  try {
    const { password } = req.body;
    const card = await Card.findById(req.params.id).lean();
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
    if (card.password !== password) return res.status(401).json({ success: false, error: 'Incorrect password' });
    const { password: pw, ...rest } = card;
    res.json({ success: true, card: rest });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
