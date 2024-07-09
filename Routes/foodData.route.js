const express = require('express');
const router = express.Router();
const { VertexAI } = require('@google-cloud/vertexai');
const Key = require('../config/key.json');
const axios = require('axios');
const APIKEY = process.env.FOOD_DATA_API;

async function analyzeFood(text) {
  const req = {
    contents: [{ role: 'user', parts: [{ text }] }],
  };
  const response = await generativeModel.generateContent(req);
  const content = response[0].response.candidates[0].content;

  try {
    // Attempt to parse the response as JSON
    const jsonData = JSON.parse(content.parts[0].text);
    return jsonData;
  } catch (error) {
    console.error('Error parsing JSON:', error);
    return { error: 'Invalid JSON response from model' };
  }
}

router.post('/', async (req, res) => {
  const foodItems = req.body.barcode;
  console.log('Food items:', foodItems);

  try {
    // Iterate through each item in foodItems
    // for (const item of foodItems) {
    const response = await axios.get(
      `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodItems}&dataType=Branded&pageSize=1&requireAllWords=true&api_key=${APIKEY}`
    );
    console.log(response.data);
    if (
      response.data &&
      response.data.foods &&
      response.data.foods.length > 0
    ) {
      const foodData = response.data.foods[0];
      const servingSizeFromAPI = foodData.servingSize;
      const servingSizeUnitFromAPI = foodData.servingSizeUnit;

      // Extract relevant nutrition information
      // const nutrients = foodData.foodNutrients.reduce((acc, nutrient) => {
      //   // Customize this list based on your desired nutrients
      //   const targetNutrients = [
      //     'Energy',
      //     'Protein',
      //     'Total lipid (fat)',
      //     'Carbohydrate, by difference',
      //     'Fiber, total dietary',
      //     'Sugars, total including NLEA',
      //   ];
      //   if (targetNutrients.includes(nutrient.nutrientName)) {
      //     acc[nutrient.nutrientName] = `${nutrient.value} ${nutrient.unitName}`;
      //   }
      //   return acc;
      // }, {});

      // nutritionFacts.push({
      //   name: item.name,
      //   servingSize: servingSizeFromAPI,
      //   servingSizeUnit: servingSizeUnitFromAPI,
      //   nutrition: nutrients,
      // });
    } else {
    }
    //}
    res.json(response.data);
  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

module.exports = router;
