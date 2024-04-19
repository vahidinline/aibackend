const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  active: Boolean,
  name: {
    name: String,
    displayName: String,
    code: String,
  },
  description: String,
  startDate: String, // You might want to use Date type here if it's a date
  endDate: String, // You might want to use Date type here if it's a date
  currency: String,
  paymantUrl: String,
  sign: String, // You might want to use a specific type like String, depending on your data
  price: {
    displayPrice: String,
    price: Number,
    priceSign: String,
    discountedPrice: Number,
    dispayDiscound: String,
  },
  priceRial: {
    displayPrice: String,
    price: Number,
    priceSign: String,
    discountedPrice: Number,
    dispayDiscound: String,
  },
  paymantText: String,
  isDiscounted: Boolean,
  period: String,
  imageSrc: String,
  href: String,
  features: [
    {
      value: String,
      status: Boolean,
    },
  ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
