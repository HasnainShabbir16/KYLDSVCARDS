const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Card Schema (includes branding, bio, address, active)
const CardSchema = new mongoose.Schema({
  name: String,
  role: String,
  department: String,
  avatar: String, // base64 string
  cover: String,  // base64 string
  phone: String,
  email: String,
  password: String,
  bio: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  branding: {
    name: { type: String, default: '' },
    abbr: { type: String, default: '' },
    tag:  { type: String, default: '' },
    url:  { type: String, default: '' },
    logo: { type: String, default: '' },
    wm:   { type: String, default: '' }
  },
  active: {
    type: Boolean,
    default: true
  }
  // ...add other member fields as needed
});

const Card = mongoose.model('Card', CardSchema);

// Create a new card
router.post('/create', async (req, res) => {
  try {
    const card = new Card({
      name: req.body.name,
      role: req.body.role,
      department: req.body.department,
      avatar: req.body.avatar,
      cover: req.body.cover,
      phone: req.body.phone,
      email: req.body.email,
      password: req.body.password,
      bio: req.body.bio || '',
      address: req.body.address || '',
      branding: req.body.branding || {},
      active: typeof req.body.active === 'boolean' ? req.body.active : true,
      // ...any other fields
    });
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
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });

    card.name       = req.body.name       ?? card.name;
    card.role       = req.body.role       ?? card.role;
    card.department = req.body.department ?? card.department;
    card.avatar     = req.body.avatar     ?? card.avatar;
    card.cover      = req.body.cover      ?? card.cover;
    card.phone      = req.body.phone      ?? card.phone;
    card.email      = req.body.email      ?? card.email;
    card.password   = req.body.password   ?? card.password;
    card.bio        = req.body.bio        ?? card.bio;
    card.address    = req.body.address    ?? card.address;
    card.active     = typeof req.body.active === 'boolean' ? req.body.active : card.active;

    // Update branding object if provided
    if(req.body.branding){
      card.branding = req.body.branding;
    }

    await card.save();
    res.json({ success: true, card });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Branding fetch route (single branding, first found)
router.get('/branding', async(req,res)=>{
  try{
    const card = await Card.findOne({ 'branding.name': { $exists:true, $ne: '' } });
    if(!card || !card.branding){
      return res.json({});
    }
    res.json(card.branding);
  }catch(err){
    res.status(500).json({ success:false });
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

// Get a card by its Mongo ObjectId (single card, password not required for basic info)
router.get('/get/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id).lean();
    if (!card) return res.status(404).json({ success: false, error: 'Card not found' });
    const { password, ...rest } = card; // exclude password from response
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
