const { default: axios } = require('axios');

const openAiFunc = async () => {
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

    return parsedContent;
  } catch (error) {
    console.log(error);
  }
};

module.exports = openAiFunc;
