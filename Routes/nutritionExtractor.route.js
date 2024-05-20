const axios = require('axios');
const express = require('express');
const router = express.Router();
const FoodItem = require('../models/nutrition.model'); // Assuming you have a FoodItem model defined

// Step 1: Extract food items and amounts
async function extractFoodItems(userInput) {
  console.log('userInput', userInput);
  const messages = [
    {
      role: 'system',
      content:
        'Extract the food items and their amounts, and return only in JSON format as a pure array of objects, where each object represents a food item, its amount and its unit. Do not include any additional text outside the JSON array.',
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
    //find the first [ and last ] and extract the content between them
    const startIndex = response.data.choices[0].message.content.indexOf('[');
    const endIndex = response.data.choices[0].message.content.lastIndexOf(']');
    const parsedContent = JSON.parse(
      response.data.choices[0].message.content.slice(startIndex, endIndex + 1)
    );

    // console.log(response.data.choices[0].message.content); // Log the raw response
    //const parsedContent = JSON.parse(response.data.choices[0].message.content);
    console.log('parsedContent', parsedContent);
    return parsedContent;
    // console.log(
    //   'data',
    //   typeof JSON.parse(response.data.choices[0].message.content),
    //   'recievied'
    // );

    // if (Array.isArray(parsedContent.food_items)) {
    //   console.log('return', parsedContent);
    //   //store the extracted food items in the database
    //   const foodItem = new FoodItem({
    //     userInput,
    //     foodItems: parsedContent.food_items,
    //   });
    //   await foodItem.save();
    //   return parsedContent.food_items;
    // } else {
    //   console.error('Invalid food items data:', parsedContent);
    // }
  } catch (error) {
    console.error('Error extracting food items:', error.message);
    throw new Error('Error extracting food items');
  }
}

// Step 2: Get nutrition facts for each food item
// async function getNutritionFacts(foodItem) {
//   const messages = [
//     {
//       role: 'system',
//       content:
//         'provide calories, Carbs, Protein, sugar, and fat in JSON format',
//     },
//     {
//       role: 'user',
//       content: `${foodItem.amount} of ${foodItem.food || foodItem.foodItem}`,
//     },
//   ];
//   console.log('messages in getNutritionFacts', messages);

//   const requestBody = {
//     messages,
//     temperature: 0,
//     top_p: 0.7,
//     frequency_penalty: 0,
//     presence_penalty: 0,
//     max_tokens: 500,
//   };

//   try {
//     const response = await axios.post(
//       `${process.env.OPENAI_FOOD_API_ENDPOINT}`,
//       requestBody,
//       {
//         headers: {
//           Authorization: `Bearer ${process.env.OPENAI_FOOD_API_KEY}`,
//         },
//       }
//     );
//     console.log(response.data.choices[0].message.content); // Log the raw response
//     return JSON.parse(response.data.choices[0].message.content);
//   } catch (error) {
//     console.error('Error getting nutrition facts:', error.message);
//     throw new Error('Error getting nutrition facts');
//   }
// }

async function getNutritionFacts(foodItem) {
  if (!foodItem || !(foodItem.food || foodItem.foodItem) || !foodItem.amount) {
    throw new Error('Invalid food item');
  }

  const messages = [
    {
      role: 'system',
      content:
        'provide calories, Carbs, Protein, sugar, and fat in JSON format',
    },
    {
      role: 'user',
      content: `${foodItem.amount} of ${foodItem.food || foodItem.foodItem}`,
    },
  ];
  console.log('messages in getNutritionFacts', messages);

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
    console.log(response.data.choices[0].message.content); // Log the raw response
    return JSON.parse(response.data.choices[0].message.content);
  } catch (error) {
    console.error('Error getting nutrition facts:', error.message);
    throw new Error('Error getting nutrition facts');
  }
}

// Step 3: Process the user input and save data
router.post('/', async (req, res) => {
  const { userInput } = req.body;

  try {
    // Extract food items and amounts
    const foodItems = await extractFoodItems(userInput);
    console.log('foodItems', foodItems);
    return res.json({ foodItems });

    if (!Array.isArray(foodItems)) {
      throw new Error('Invalid food items data');
    }

    // Get nutrition facts for each food item
    const nutrients = {
      foods: [],
    };
    for (const item of foodItems) {
      console.log('item', item);

      const nutritionFacts = await getNutritionFacts(item);
      nutrients.foods.push(nutritionFacts);
    }

    // Save the result to MongoDB
    const foodItem = new FoodItem({
      userInput,
      nutrients,
    });
    await foodItem.save();

    res.json({ message: 'Response saved successfully' });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

// module.exports = {
//   extractFoodItems,
//   getNutritionFacts, // Make sure to export the function
//   // ... other exports
// };
