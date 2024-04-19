const mongoose = require('mongoose');

const paymentHistory = new mongoose.Schema({
  userId: String,
  action: String,
  location: String,
  amount: Number,
  date: {
    type: Date,
    default: Date.now,
  },
  data: [mongoose.Schema.Types.Mixed],
});

const PaymentHistory = mongoose.model('paymentHistory', paymentHistory);

module.exports = PaymentHistory;
