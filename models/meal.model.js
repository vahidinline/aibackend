const mongoose = require('mongoose');

const MealSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now },
  mealName: String,
  foodItems: [
    {
      food: String,
      amount: String,
      calories: Number,
      carbs: Number,
      protein: Number,
      sugar: Number,
      fat: Number,
    },
  ],
});

module.exports = mongoose.model('MealSchema', MealSchema);
