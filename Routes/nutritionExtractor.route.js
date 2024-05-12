const axios = require('axios');
const express = require('express');
const router = express.Router();

// Assuming you have body-parser middleware configured
router.post('/', async (req, res) => {
  console.log(req.body);

  const { messages } = req.body;

  const userInput = messages[1].content;

  // Create requestBody with adjusted max_tokens
  const requestBody = {
    messages,
    temperature: 0.3,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    // Define or remove the stop property according to API documentation
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
    console.log(response.data.choices[0].message.content);
    const nutrientsString = response.data.choices[0].message.content;

    const reply = {
      name: userInput,
      nutrients: [JSON.parse(nutrientsString)],
    };

    res.json(reply);
  } catch (error) {
    console.error(error.response.data);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
