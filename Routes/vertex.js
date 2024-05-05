const express = require('express');
const router = express.Router();
const {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} = require('@google/generative-ai');

const MODEL_NAME = 'gemini-1.0-pro-001';
const API_KEY = process.env.GEMINI_API_KEY;

async function run(req, res) {
  const text = req.body;
  const genAI = new GoogleGenerativeAI(API_KEY);
  const model = genAI.getGenerativeModel({ model: MODEL_NAME });
  console.log(text);

  const generationConfig = {
    temperature: 1,
    topK: 0,
    topP: 0.95,
    maxOutputTokens: 8192,
  };

  const safetySettings = [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ];

  const parts = [
    text,
    {
      text: 'output:json structure contain the food item name, amount, amount unit , full nutrition facts ',
    },
  ];

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts }],
      generationConfig,
      safetySettings,
    });
    const content = result[0].response.candidates[0].content;
    const jsonString = content.parts[0].text;

    // Parse the JSON string into a JavaScript object
    const jsonData = JSON.parse(jsonString);

    // Send only the parsed JSON data to the user
    res.json(jsonData);
  } catch (error) {
    console.error('Error handling message:', error);
    res.send(error);
  }
}

router.post('/', run);

router.get('/', (req, res) => {
  res.send('AI Backend');
});

module.exports = router;
