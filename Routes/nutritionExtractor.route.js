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
        '"Given a description of food items, return the details in a JSON format as an array of objects. Each object should contain the food items name, its amount, and its unit. If the food items name is unclear or multiple items are detected, include an additional field in the object to flag the item as requiring further clarification. The JSON output should exclusively consist of this array, with no external text or information.Structure for a clear, identified food item in the JSON should include:  - name: String (the name of the food item)  - amount: Number (the quantity of the food item)  - unit: String (the measurement unit for the quantity).If the food item is unclear or there are multiple items detected, the structure should also include:  - unclear: Boolean (true if the item requires clarification) .Example JSON output for well-identified items:  [  {  "name": "Bananas", "amount": 3,   "unit": "pieces" },  { "name": "Milk",  "amount": 2,  "unit": "liters"  }  ]  Example JSON output for items requiring clarification:  [ {  "name": "",   "amount": 0,   "unit": "",   "unclear": true  }  ]"  ',
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

async function getNutritionFacts(foodItems) {
  const { name, amount, unit } = foodItems;
  // if (!foodItem || !(foodItem.food || foodItem.foodItem) || !foodItem.amount) {
  //   throw new Error('Invalid food item');
  // }

  const messages = [
    {
      role: 'system',
      content:
        'provide calories, Carbs, Protein, sugar, and fat in JSON format.If you dont find any information about the food item or need to be more specific,return a JSON with the food item and amount only.',
    },
    {
      role: 'user',

      content: `${amount} - ${unit} of ${foodItem}`,
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

router.post('/addfood', async (req, res) => {
  const { foodItems, userId } = req.body;

  try {
    const nutritionFacts = await getNutritionFacts(foodItems);
    console.log('nutritionFacts', nutritionFacts);

    // // Save the result to MongoDB
    // const foodItem = new FoodItem({
    //   userInput,
    //   nutrients,
    // });
    //await foodItem.save();

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
