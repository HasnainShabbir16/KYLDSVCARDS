const mongoose = require('mongoose');

const BrandingSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  abbr: { type: String, default: '' },
  tag:  { type: String, default: '' },
  url:  { type: String, default: '' },
  logo: { type: String, default: '' },
  wm:   { type: String, default: '' },
});
module.exports = mongoose.model('Branding', BrandingSchema);
