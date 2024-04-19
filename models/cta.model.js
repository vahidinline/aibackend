const mongoose = require('mongoose');

const CTA = {
  name: String,
  email: String,
};

const StaticPageScheme = mongoose.model('cta', CTA);

module.exports = StaticPageScheme;
