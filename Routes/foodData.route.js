const express = require('express');
const router = express.Router();
const axios = require('axios');
const mongoose = require('mongoose');

// Importing Meal model
const Meal = require('../models/meal.model'); // Adjust the path as needed
const storeFoodItem = require('../middleware/storeFoodItems');
const getsingleMealResult = require('../middleware/getSingleMealResult');

// Function to get nutrition data from Open Food Facts API and format it to match FoodItemSchema
async function getNutritionData(barcode) {
  try {
    const response = await axios.get(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
    );

    // Log the full response from the Open Food Facts API
    // console.log(
    //   'Open Food Facts API Response:',
    //   JSON.stringify(response.data, null, 2)
    // );

    if (response.data && response.data.product) {
      const productData = response.data.product;

      return {
        food_item: productData.product_name,
        serving_size: 100,
        calories: {
          amount: productData.nutriments['energy-kcal'] || '0',
          unit: 'kcal',
        },
        total_fat: {
          amount: productData.nutriments['fat'] || '0',
          unit: 'g',
        },
        saturated_fat: {
          amount: productData.nutriments['saturated-fat'] || '0',
          unit: 'g',
        },
        cholesterol: {
          amount: '0', // Open Food Facts API doesn't provide cholesterol data
          unit: 'mg',
        },
        sodium: {
          amount: productData.nutriments['sodium'] || '0',
          unit: 'mg',
        },
        total_carbohydrates: {
          amount: productData.nutriments['carbohydrates'] || '0',
          unit: 'g',
        },
        dietary_fiber: {
          amount: productData.nutriments['fiber'] || '0',
          unit: 'g',
        },
        sugars: {
          amount: productData.nutriments['sugars'] || '0',
          unit: 'g',
        },
        protein: {
          amount: productData.nutriments['proteins'] || '0',
          unit: 'g',
        },
        vitamins_and_minerals: {
          vitamin_a: {
            amount: '0', // Open Food Facts API doesn't provide vitamin A data
            unit: 'µg',
          },
          vitamin_c: {
            amount: '0', // Open Food Facts API doesn't provide vitamin C data
            unit: 'mg',
          },
          calcium: {
            amount: productData.nutriments['calcium'] || '0',
            unit: 'mg',
          },
          iron: {
            amount: productData.nutriments['iron'] || '0',
            unit: 'mg',
          },
        },
      };
    } else {
      console.log('No food data found for barcode:', barcode);
      return { error: 'No food data found for the provided barcode' };
    }
  } catch (error) {
    console.error('Error fetching data from Open Food Facts API:', error);
    return { error: 'Failed to fetch data from Open Food Facts API' };
  }
}

router.post('/', async (req, res) => {
  const { barcode, userId, mealName, servingSize } = req.body;
  console.log('Barcode', barcode, userId, mealName, servingSize);

  const inputType = 'barcode';
  if (!barcode || !userId || !mealName || !servingSize) {
    return res
      .status(400)
      .json({ error: 'Barcode, userId, and mealName are required' });
  }

  try {
    const nutritionData = await getNutritionData(barcode);
    if (nutritionData.error) {
      console.error('Nutrition data error:', nutritionData.error);
      return res.status(404).json({ error: nutritionData.error });
    }
    const saveResult = await storeFoodItem(
      nutritionData,
      userId,
      mealName,
      inputType
    );
    if (!saveResult) {
      return res.status(500).json({ error: 'Failed to save food items' });
    }
    const foodId = saveResult._id.toString();
    const getResult = await getsingleMealResult(userId, mealName);
    if (getResult === null) {
      return res.status(500).json({ error: 'No food item found' });
    }

    // Successfully retrieved and stored food items
    console.log('got final Result');
    res.json({
      currentFood: saveResult,
      status: 200,
      foodId: foodId,
      data: getResult,
      mealName: mealName,
      foodItems: [
        {
          userInput: saveResult?.foodItems[0].food_item,
          userId: userId,
          selectedMeal: mealName,
        },
      ], // Changed to dataArray to represent all user inputs
    });

    // Return a consistent response format
    //res.json({ nutritionFacts: nutritionData, mealId: newMeal._id });
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;

// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// // Importing Meal model
// const Meal = require('../models/meal.model'); // Adjust the path as needed
// const storeFoodItem = require('../middleware/storeFoodItems');
// const getsingleMealResult = require('../middleware/getSingleMealResult');

// // Function to get nutrition data from Open Food Facts API and format it to match FoodItemSchema
// async function getNutritionData(barcode) {
//   try {
//     const response = await axios.get(
//       `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
//     );

//     if (response.data && response.data.product) {
//       const productData = response.data.product;

//       const servingSize = productData.serving_size || '100g'; // Default to 100g if not available
//       const servingSizeValue = parseFloat(servingSize); // Extract numeric value, handle as grams or ml

//       return {
//         food_item: productData.product_name,
//         serving_size: servingSize, // Original serving size
//         serving_size_value: servingSizeValue, // Numeric value of serving size
//         calories: {
//           amount: productData.nutriments['energy-kcal'] || '0',
//           unit: 'kcal',
//         },
//         total_fat: {
//           amount: productData.nutriments['fat'] || '0',
//           unit: 'g',
//         },
//         saturated_fat: {
//           amount: productData.nutriments['saturated-fat'] || '0',
//           unit: 'g',
//         },
//         cholesterol: {
//           amount: '0', // Open Food Facts API doesn't provide cholesterol data
//           unit: 'mg',
//         },
//         sodium: {
//           amount: productData.nutriments['sodium'] || '0',
//           unit: 'mg',
//         },
//         total_carbohydrates: {
//           amount: productData.nutriments['carbohydrates'] || '0',
//           unit: 'g',
//         },
//         dietary_fiber: {
//           amount: productData.nutriments['fiber'] || '0',
//           unit: 'g',
//         },
//         sugars: {
//           amount: productData.nutriments['sugars'] || '0',
//           unit: 'g',
//         },
//         protein: {
//           amount: productData.nutriments['proteins'] || '0',
//           unit: 'g',
//         },
//         vitamins_and_minerals: {
//           vitamin_a: {
//             amount: '0', // Open Food Facts API doesn't provide vitamin A data
//             unit: 'µg',
//           },
//           vitamin_c: {
//             amount: '0', // Open Food Facts API doesn't provide vitamin C data
//             unit: 'mg',
//           },
//           calcium: {
//             amount: productData.nutriments['calcium'] || '0',
//             unit: 'mg',
//           },
//           iron: {
//             amount: productData.nutriments['iron'] || '0',
//             unit: 'mg',
//           },
//         },
//       };
//     } else {
//       console.log('No food data found for barcode:', barcode);
//       return { error: 'No food data found for the provided barcode' };
//     }
//   } catch (error) {
//     console.error('Error fetching data from Open Food Facts API:', error);
//     return { error: 'Failed to fetch data from Open Food Facts API' };
//   }
// }

// // Helper function to adjust nutritional values based on serving size
// function adjustNutritionFacts(nutritionData, userServingSize) {
//   // If userServingSize is 1, it means full serving, so no adjustment needed
//   if (userServingSize === 1) {
//     return nutritionData;
//   }

//   const adjustmentFactor = userServingSize;

//   const adjustValue = (amount) =>
//     (parseFloat(amount) * adjustmentFactor).toFixed(2);

//   return {
//     ...nutritionData,
//     calories: {
//       ...nutritionData.calories,
//       amount: adjustValue(nutritionData.calories.amount),
//     },
//     total_fat: {
//       ...nutritionData.total_fat,
//       amount: adjustValue(nutritionData.total_fat.amount),
//     },
//     saturated_fat: {
//       ...nutritionData.saturated_fat,
//       amount: adjustValue(nutritionData.saturated_fat.amount),
//     },
//     sodium: {
//       ...nutritionData.sodium,
//       amount: adjustValue(nutritionData.sodium.amount),
//     },
//     total_carbohydrates: {
//       ...nutritionData.total_carbohydrates,
//       amount: adjustValue(nutritionData.total_carbohydrates.amount),
//     },
//     dietary_fiber: {
//       ...nutritionData.dietary_fiber,
//       amount: adjustValue(nutritionData.dietary_fiber.amount),
//     },
//     sugars: {
//       ...nutritionData.sugars,
//       amount: adjustValue(nutritionData.sugars.amount),
//     },
//     protein: {
//       ...nutritionData.protein,
//       amount: adjustValue(nutritionData.protein.amount),
//     },
//     vitamins_and_minerals: {
//       ...nutritionData.vitamins_and_minerals,
//       calcium: {
//         ...nutritionData.vitamins_and_minerals.calcium,
//         amount: adjustValue(nutritionData.vitamins_and_minerals.calcium.amount),
//       },
//       iron: {
//         ...nutritionData.vitamins_and_minerals.iron,
//         amount: adjustValue(nutritionData.vitamins_and_minerals.iron.amount),
//       },
//     },
//   };
// }

// router.post('/', async (req, res) => {
//   const { barcode, userId, mealName, servingSize } = req.body;
//   console.log('Barcode', barcode, userId, mealName, servingSize);

//   const inputType = 'barcode';
//   if (!barcode || !userId || !mealName || servingSize === undefined) {
//     return res.status(400).json({
//       error: 'Barcode, userId, mealName, and servingSize are required',
//     });
//   }

//   try {
//     let nutritionData = await getNutritionData(barcode);
//     if (nutritionData.error) {
//       console.error('Nutrition data error:', nutritionData.error);
//       return res.status(404).json({ error: nutritionData.error });
//     }

//     // Adjust the nutrition data based on the serving size provided by the user
//     const userServingSize = parseFloat(servingSize);
//     nutritionData = adjustNutritionFacts(nutritionData, userServingSize);

//     const saveResult = await storeFoodItem(
//       nutritionData,
//       userId,
//       mealName,
//       inputType
//     );
//     if (!saveResult) {
//       return res.status(500).json({ error: 'Failed to save food items' });
//     }
//     const foodId = saveResult._id.toString();
//     const getResult = await getsingleMealResult(userId, mealName);
//     if (getResult === null) {
//       return res.status(500).json({ error: 'No food item found' });
//     }

//     // Successfully retrieved and stored food items
//     console.log('got final Result');
//     res.json({
//       currentFood: saveResult,
//       status: 200,
//       foodId: foodId,
//       data: getResult,
//       mealName: mealName,
//       foodItems: [
//         {
//           userInput: saveResult?.foodItems[0].food_item,
//           userId: userId,
//           selectedMeal: mealName,
//         },
//       ],
//     });
//   } catch (error) {
//     console.error('Error processing request:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// module.exports = router;
