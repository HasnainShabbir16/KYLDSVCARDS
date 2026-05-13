// models/Card.js - Mongoose schema for vCard QR system
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  title: { type: String },
  phone: { type: String },
  email: { type: String },
  website: { type: String },
  image: { type: String }, // Stores uploaded filename
  passwordHash: { type: String },
});

module.exports = mongoose.model('Card', cardSchema);
