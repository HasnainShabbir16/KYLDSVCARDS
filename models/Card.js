// models/Card.js - Mongoose schema for vCard QR system
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  title:    { type: String },
  phone:    { type: String },
  email:    { type: String },
  website:  { type: String },
  image:    { type: String },        // Profile photo or avatar (url or base64)
  bio:      { type: String, default: '' },
  address:  { type: String, default: '' }, // Optional address field

  // Branding (logo, watermark, etc), recommended as an object for flexibility:
  branding: {
    name: { type: String, default: '' },
    abbr: { type: String, default: '' },
    tag:  { type: String, default: '' },
    url:  { type: String, default: '' },
    logo: { type: String, default: '' }, // logo image (url or base64)
    wm:   { type: String, default: '' }, // watermark image
  },

  active:      { type: Boolean, default: true },  // For card active/inactive toggle
  passwordHash:{ type: String },                  // For secure password storage, if using bcrypt/hash
});

module.exports = mongoose.model('Card', cardSchema);
