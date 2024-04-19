const axios = require('axios');

async function getNutrition(ingredients) {
  console.log('Getting nutrition info for:', ingredients);
  const results = [];

  for (const ingredient of ingredients) {
    //console.log('Getting nutrition info for:', ingredient);
    try {
      const response = await axios.get(
        'https://api.api-ninjas.com/v1/nutrition',
        {
          params: {
            query: ingredient,
          },
          headers: {
            'X-Api-Key': process.env.NINJA_NUTRITION_API,
          },
        }
      );
      //console.log('Nutrition info:', response.data);
      results.push(response.data);
    } catch (error) {
      console.error('Error getting nutrition info:', error);
      // If one request fails, don't stop the entire process
    }
  }

  return results;
}

module.exports = getNutrition;
