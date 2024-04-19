const mongoose = require('mongoose');

const appPriceSchema = {
  title: String,
  price: Number,
  description: String,
  currency: String,
  sign: String,
  priceType: String,
  priceTier: Number,
  priceDisplay: String,
  active: Boolean,
};

const AppPriceSchema = mongoose.model('appPriceSchema', appPriceSchema);

module.exports = AppPriceSchema;
