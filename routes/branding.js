const express = require('express');
const router = express.Router();
const Branding = require('../models/Branding');

// GET universal branding object
router.get('/', async (req, res) => {
  let b = await Branding.findOne({});
  if (!b) b = await Branding.create({});
  res.json(b);
});

// POST (admin changes) — upsert branding object (replace all fields)
router.post('/', async (req, res) => {
  const update = req.body;
  let b = await Branding.findOneAndUpdate({}, update, { upsert: true, new: true });
  res.json(b);
});

module.exports = router;
