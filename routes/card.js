// routes/card.js - All card API endpoints
const express = require('express');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const path = require('path');
const Card = require('../models/Card');
const QRCode = require('qrcode');
const fs = require('fs');
const router = express.Router();

// Setup image upload
const upload = multer({
  dest: path.join(__dirname, '../public/images/'),
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files allowed!'));
    } else {
      cb(null, true);
    }
  },
});

// POST /create-card
router.post('/create-card', upload.single('image'), async (req, res) => {
  try {
    const { name, title, phone, email, website, password } = req.body;
    let image = '';
    if (req.file) image = req.file.filename;
    let passwordHash = '';
    if (password) passwordHash = await bcrypt.hash(password, 10);
    const card = await Card.create({
      name, title, phone, email, website, image, passwordHash
    });
    const url = `/card/${card._id}`;
    const qrcode = await QRCode.toDataURL(url);
    res.json({ success: true, id: card._id, url, qrcode });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// POST /verify-password/:id
router.post('/verify-password/:id', async (req, res) => {
  const { password } = req.body;
  const card = await Card.findById(req.params.id);
  if (!card) return res.status(404).json({ valid: false });
  if (!card.passwordHash) return res.json({ valid: true }); // If no password, always valid!
  const match = await bcrypt.compare(password || '', card.passwordHash);
  res.json({ valid: match });
});

// GET /card/:id
router.get('/card/:id', async (req, res) => {
  const card = await Card.findById(req.params.id).lean();
  if (!card) return res.status(404).json({ error: 'Not found' });
  // Do NOT return hash!
  const { passwordHash, ...cardSafe } = card;
  cardSafe.isProtected = Boolean(card.passwordHash);
  res.json(cardSafe);
});

// GET /download/:id (VCF download)
router.get('/download/:id', async (req, res) => {
  const card = await Card.findById(req.params.id).lean();
  if (!card) return res.status(404).send('No card');
  const vcf = `BEGIN:VCARD\nVERSION:3.0\nFN:${card.name}\nTITLE:${card.title || ''}\nTEL:${card.phone || ''}\nEMAIL:${card.email || ''}\nURL:${card.website || ''}\nEND:VCARD`;
  res.setHeader('Content-Type', 'text/vcard');
  res.setHeader('Content-Disposition', `attachment; filename="${card.name || 'contact'}.vcf"`);
  res.send(vcf);
});

module.exports = router;
