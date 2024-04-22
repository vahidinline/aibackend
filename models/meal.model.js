const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now },
  meal_name: String,
  meal: [{}],
});

module.exports = mongoose.model('MealSchema', MealSchema);
