const mongoose = require('mongoose');
const { stringify } = require('nodemon/lib/utils');
const Schema = mongoose.Schema;
const payTempSchema = new Schema({
  name: String,
  authority: String,
  email: String,
  amount: String,
  paid: Boolean,
  date: {
    type: Date,
    default: Date.now,
  },
  product: String,
});

const PayTempSchema = mongoose.model('payTempRial', payTempSchema);

module.exports = PayTempSchema;
