const axios = require('axios');

async function getNutrition(ingredients, amount) {
  console.log('Getting nutrition info for:', ingredients, amount);
  const results = [];

  // Parse the amount to a number
  const amountInGrams = parseFloat(amount[0]);

  for (const ingredient of ingredients) {
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

      // If the response is successful, calculate the nutrition based on the amount
      if (response.data && response.data.length > 0) {
        const nutritionInfo = response.data[0]; // Assuming the API returns an array and we're interested in the first object
        const servingSize = parseFloat(nutritionInfo.serving_size_g);

        // Calculate the ratio of the amount to the serving size
        const ratio = amountInGrams / servingSize;

        // Update the nutrition info based on the ratio
        for (const key in nutritionInfo) {
          if (key !== 'name' && key !== 'serving_size_g') {
            // We don't want to change the 'name' and 'serving_size_g'
            const value = parseFloat(nutritionInfo[key]);
            if (!isNaN(value)) {
              // Make sure the value is a number
              nutritionInfo[key] = value * ratio;
            }
          }
        }

        console.log('Adjusted Nutrition info:', nutritionInfo);
        results.push(nutritionInfo);
      }
    } catch (error) {
      console.error('Error getting nutrition info:', error);
    }
  }

  return results;
}

module.exports = getNutrition;
