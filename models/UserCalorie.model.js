const mongoose = require('mongoose');

const UserCalorieSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now },
  targetCalorie: Number,
  status: { type: String, default: 'noSet' },
  tagetCarbs: { percent: Number, amount: Number },
  targetProtein: { percent: Number, amount: Number },
  targetFat: { percent: Number, amount: Number },
});

module.exports = mongoose.model('UserCalorie', UserCalorieSchema);
