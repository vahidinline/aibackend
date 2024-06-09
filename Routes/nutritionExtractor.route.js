const axios = require('axios');
const express = require('express');
const router = express.Router();
const Meal = require('../models/meal.model');
const calculateTotalNutritionBetweenDates = require('../middleware/customReport');
const { customFoodFinder } = require('../middleware/customfood');
const foodExtractorGmini = require('./vertex');
const foodChecker = require('../middleware/foodchecker');
const LogErrorSchema = require('../models/ErrorLog.model');

// Step 1: Extract food items and amounts
async function extractFoodItems(userInput, userId) {
  console.log('userInpu in extractFoodItems', userInput);

  // const customFood = await foodExtractorGmini(userInput);
  // console.log('customFood', customFood);
  // start = customFood.indexOf('[');
  // end = customFood.lastIndexOf(']');
  // result = customFood.slice(start, end + 1);

  // const parsedContent = JSON.parse(result);
  // console.log('parsedContent', parsedContent);
  // return parsedContent;
  const messages = [
    {
      role: 'system',
      content:
        '"Given a description of food items, return the details in a JSON format as an array of objects.If it is not a food item, return "false". Each object should contain the food items name (translated to English if not), its amount, and its unit. If the food items name is unclear or multiple items are detected, include an additional field in the object to flag the item as requiring further clarification. The JSON output should exclusively consist of this array, with no external text or information.Structure for a clear, identified food item in the JSON should include:  - name: String (the name of the food item)  - amount: Number (the quantity of the food item)  - unit: String (the measurement unit for the quantity).If the food item is unclear or there are multiple items detected, the structure should also include:  - unclear: Boolean (true if the item requires clarification) .Example JSON output for well-identified items:  [  {  "name": "Bananas", "amount": 3,   "unit": "pieces" },  { "name": "Milk",  "amount": 2,  "unit": "liters"  }  ]  Example JSON output for items requiring clarification:  [ {  "name": "",   "amount": 0,   "unit": "",   "unclear": true  }  ]"  do not include any explanation',
    },
    { role: 'user', content: `${userInput}` },
  ];

  const requestBody = {
    messages,
    temperature: 0,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
  };

  try {
    const response = await axios.post(
      `${process.env.OPENAI_FOOD_API_ENDPOINT}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_FOOD_API_KEY}`,
        },
      }
    );
    console.log('response', response.data.choices[0].message.content);

    const startIndex = response.data.choices[0].message.content.indexOf('[');
    const endIndex = response.data.choices[0].message.content.lastIndexOf(']');
    const parsedContent = JSON.parse(
      response.data.choices[0].message.content.slice(startIndex, endIndex + 1)
    );
    console.log('parsedContent', parsedContent);
    // const checkfood = await foodChecker(parsedContent,userId);
    // if (checkfood) {
    //   return { checkfood };
    // } else return { error: 'Error extracting food items' };
    return parsedContent;
  } catch (error) {
    console.error('Error extracting food items: line 74 user Id', userId);
    const errorLog = new LogErrorSchema({
      error: error.message,
      userId: userId,
      errorData: error,
    });

    await errorLog.save();

    console.error('Error extracting food items: line 74', error.message);
    throw new Error('Error extracting food items');
  }
}

// Step 2: Get nutrition facts for each food item

async function getNutritionFacts(foodItems, userId) {
  const { name, amount, unit } = foodItems;

  const messages = [
    {
      role: 'system',
      content: `Please provide the nutrition facts for the following food item in valid JSON format, with the amount and unit for each nutrient specified separately. Include fields for food_item, serving_size, calories, total_fat, saturated_fat, cholesterol, sodium, total_carbohydrates, dietary_fiber, sugars, protein, and vitamins_and_minerals, with separate values for the amount and unit of each nutrient. For nutrients or vitamins and minerals, if specific information is not available, include the field with the amount as "N/A" and the unit field empty. Use error codes 500 for unclear requests and 404 for data not found.`,
    },
    {
      role: 'user',
      content: `${amount} - ${unit} of ${name}`,
    },
  ];

  console.log('messages in getNutritionFacts', messages);

  const requestBody = {
    messages,
    temperature: 0,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
  };

  try {
    const response = await axios.post(
      `${process.env.OPENAI_FOOD_API_ENDPOINT}`,
      requestBody,
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_FOOD_API_KEY}`,
        },
      }
    );
    console.log('Finall result', response.data.choices[0].message.content); // Log the raw response
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    const errorLog = new LogErrorSchema({
      error: error.message,
      userId: userId,
      errorData: error,
    });

    await errorLog.save();
    //console.error('Error getting nutrition facts:', error.message);
    //return response.data.choices[0].message.content;
    throw new Error('Error getting nutrition facts');
  }
}

// Step 3: Process the user input and save data
router.post('/', async (req, res) => {
  const { userInput, userId } = req.body;
  console.log('user id in initial req', userId);

  try {
    // Extract food items and amounts

    const foodItems = await extractFoodItems(userInput, userId);
    return res.json({ foodItems });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
    const errorLog = new LogErrorSchema({
      error: error.message,
      userId: userId,
      errorData: error,
    });

    await errorLog.save();
  }
});

router.post('/addfood', async (req, res) => {
  const { foodItems, userId, selectedMeal } = req.body;
  console.log('foodItems', foodItems);
  try {
    const nutritionFacts = await getNutritionFacts(foodItems, userId);
    console.log('nutritionFacts', nutritionFacts);

    const meal = new Meal({
      userId,
      mealName: selectedMeal,
      foodItems: nutritionFacts,
    });

    await meal.save();

    res.json(nutritionFacts);
  } catch (error) {
    const errorLog = new LogErrorSchema({
      error: error.message,
      userId: userId,
      errorData: error,
    });

    await errorLog.save();
    response.data.choices[0].message.content;
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

async function calculateTotalNutritionForDay(userId, date = new Date()) {
  try {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const aggregateResult = await Meal.aggregate([
      {
        $match: { userId: userId, date: { $gte: startOfDay, $lte: endOfDay } },
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
    const errorLog = new LogErrorSchema({
      error: err.message,
      userId: userId,
      errorData: err,
    });

    await errorLog.save();
    console.error(err);
    return null;
  }
}

router.get('/dailyreport/:id', async (req, res) => {
  const { id } = req.params;
  const date = new Date().toISOString().split('T')[0];
  console.log('id in dailyreport', id);

  try {
    const totalNutrition = await calculateTotalNutritionForDay(id);

    res.json(totalNutrition);
  } catch (error) {
    const errorLog = new LogErrorSchema({
      error: error.message,
      userId: userId,
      errorData: error,
    });

    await errorLog.save();
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.get('/weeklyreport/:id', async (req, res) => {
  const { id } = req.params;
  const date = new Date().toISOString().split('T')[0];
  console.log('id in weeklyreport', id);
  try {
    const totalNutrition = await calculateTotalNutritionForDay(id, date);
    res.json(totalNutrition);
  } catch (error) {
    const errorLog = new LogErrorSchema({
      error: error.message,
      userId: userId,
      errorData: error,
    });

    await errorLog.save();
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/customreport/', async (req, res) => {
  const { startDate, endDate, userId } = req.query;

  console.log('startDate', startDate);
  console.log('endDate', endDate);
  console.log('userId in custom report', userId);
  const start = new Date(startDate);
  const end = new Date(endDate);
  const daysBetween = Math.floor((end - start) / (1000 * 60 * 60 * 24));
  console.log('daysBetween', daysBetween);

  try {
    const totalNutrition = await calculateTotalNutritionBetweenDates(
      userId,
      startDate,
      endDate,
      daysBetween
    );
    console.log('totalNutrition', totalNutrition);
    res.json({
      startDate,
      endDate,
      daysBetween,
      totalNutrition,
    });
  } catch (error) {
    const errorLog = new LogErrorSchema({
      error: error.message,
      userId: userId,
      errorData: error,
    });

    await errorLog.save();
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
