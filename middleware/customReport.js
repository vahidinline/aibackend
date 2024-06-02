const Meal = require('../models/meal.model');

async function calculateTotalNutritionBetweenDates(userId, startDate, endDate) {
  try {
    // Ensure dates are at the start and end of their respective days
    const startOfPeriod = new Date(startDate);
    startOfPeriod.setHours(0, 0, 0, 0);

    const endOfPeriod = new Date(endDate);
    endOfPeriod.setHours(23, 59, 59, 999);

    const aggregateResult = await Meal.aggregate([
      {
        $match: {
          userId: userId,
          date: { $gte: startOfPeriod, $lte: endOfPeriod },
        },
      },
      { $unwind: '$foodItems' },
      {
        $group: {
          _id: null,
          totalCalories: { $sum: { $toDouble: '$foodItems.calories.amount' } },
          totalFat: { $sum: { $toDouble: '$foodItems.total_fat.amount' } },
          totalProtein: { $sum: { $toDouble: '$foodItems.protein.amount' } },
          totalFiber: {
            $sum: { $toDouble: '$foodItems.dietary_fiber.amount' },
          },
          totalSodium: { $sum: { $toDouble: '$foodItems.sodium.amount' } },
          totalCarbs: {
            $sum: { $toDouble: '$foodItems.total_carbohydrates.amount' },
          },
          // Add other nutritional components as needed
        },
      },
    ]);

    console.log(aggregateResult);
    return aggregateResult;
  } catch (err) {
    console.error(err);
    return null;
  }
}

module.exports = calculateTotalNutritionBetweenDates;
