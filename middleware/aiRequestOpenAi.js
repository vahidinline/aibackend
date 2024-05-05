const endpoint = process.env['AZURE_ENDPOINT'];
const azureApiKey = process.env['AZURE_KEY'];
const openai = require('openai');
openai.apiKey = process.env.OPENAI_API_KEY;
const { default: axios } = require('axios');

async function aiRequestOpenAi(userText) {
  const requestBody = {
    messages: [
      {
        role: 'user',
        content: `Please return a JSON format of extracted meal name, remove the plural and extract the amount in grams or size or whatever user inputted. If the input is not in English, translate it to English: ${userText}`,
      },
    ],
    temperature: 0.3,
    top_p: 0.7,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 4000,
    stop: null,
  };

  const response = await axios.post(`${endpoint}`, requestBody, {
    headers: {
      Authorization: `Bearer ${azureApiKey}`,
    },
  });

  const aiResponse = response.data.choices[0].message['content'];

  return aiResponse;
}

module.exports = aiRequestOpenAi;
