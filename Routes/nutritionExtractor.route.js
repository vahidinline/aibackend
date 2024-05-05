const endpoint = process.env.OPENAI_FOOD_API_ENDPOINT;
const azureApiKey = process.env.OPENAI_FOOD_API_KEY;
const axios = require('axios');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  console.log(req.body);

  const { messages } = req.body;

  // Create requestBody with adjusted max_tokens
  const requestBody = {
    messages,
    temperature: 0.3,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stop: null,
  };

  try {
    const response = await axios.post(`${endpoint}`, requestBody, {
      headers: {
        Authorization: `Bearer ${azureApiKey}`,
      },
    });
    //console.log(response.data);
    res.send(response.data.choices[0].message.content);
  } catch (error) {
    console.error(error.response.data);
  }
});

module.exports = router;
