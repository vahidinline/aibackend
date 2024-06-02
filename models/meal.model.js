const mongoose = require('mongoose');

const NutritionSchema = new mongoose.Schema({
  amount: String,
  unit: String,
});

const VitaminsAndMineralsSchema = new mongoose.Schema({
  vitamin_a: NutritionSchema,
  vitamin_c: NutritionSchema,
  calcium: NutritionSchema,
  iron: NutritionSchema,
});

const FoodItemSchema = new mongoose.Schema({
  food_item: String,
  serving_size: NutritionSchema,
  calories: NutritionSchema,
  total_fat: NutritionSchema,
  saturated_fat: NutritionSchema,
  cholesterol: NutritionSchema,
  sodium: NutritionSchema,
  total_carbohydrates: NutritionSchema,
  dietary_fiber: NutritionSchema,
  sugars: NutritionSchema,
  protein: NutritionSchema,
  vitamins_and_minerals: VitaminsAndMineralsSchema,
});

const MealSchema = new mongoose.Schema({
  userId: String,
  date: { type: Date, default: Date.now },
  mealName: String,
  foodItems: [FoodItemSchema],
});

module.exports = mongoose.model('Meal', MealSchema);
