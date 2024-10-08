const express = require('express');
const router = express.Router();
const Conversation = require('../models/conversation.model');
const Message = require('../models/message.model');
const { mongoose } = require('../models');
const { default: axios } = require('axios');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const endpoint = process.env['OPENAI_FOOD_API_ENDPOINT'];
const azureApiKey = process.env['AZURE_KEY'];
const dalleEndpoint = process.env['AZURE_DALLE_ENDPOINT']; // New DALL-E endpoint

router.post('/dalle', async (req, res) => {
  try {
    const { prompt, n } = req.body;
    const client = new OpenAIClient(
      dalleEndpoint,
      new AzureKeyCredential(azureApiKey)
    );
    const deploymentName = 'Dalle3';
    const results = await client.getImages(deploymentName, prompt, { n });
    const imageUrl = results.data[0].url;

    res.status(200).json({ imageUrl });
  } catch (error) {
    console.log('error', error);
    res.status(500).json({ error: error });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = req.query.userId;
    console.log(userId);
    const newConversation = new Conversation({
      _id: new mongoose.Types.ObjectId(),
      user_Id: mongoose.Types.ObjectId(userId),
      created_At: new Date(),
      updated_At: new Date(),
    });

    const conversation = await newConversation.save();
    res.status(201).json({ conversationId: conversation._id });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.post('/combined', async (req, res) => {
  try {
    const { conversationId, messages, n, responseType } = req.body;
    console.log('data', messages, conversationId, n, responseType);

    let aiResponse, imageUrl;

    // GPT-3 chat
    if (responseType === 'text' || responseType === 'both') {
      console.log('Generating text');
      const chatRequestBody = {
        messages,
        temperature: 0.3,
        top_p: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 4000,
        stop: null,
      };

      const chatResponse = await axios.post(`${endpoint}`, chatRequestBody, {
        headers: {
          Authorization: `Bearer ${azureApiKey}`,
        },
      });
      console.log(chatResponse.data);
      aiResponse = chatResponse.data.choices[0].message['content'];
    }

    // DALL-E image generation
    if (responseType === 'image' || responseType === 'both') {
      //console.log('Generating image', messages[-1].content);
      const client = new OpenAIClient(
        dalleEndpoint,
        new AzureKeyCredential(azureApiKey)
      );
      const deploymentName = 'Dalle3';
      const imageResults = await client.getImages(
        deploymentName,
        //messages[-1].content,
        messages[messages.length - 1].content,
        {
          n,
        }
      );
      imageUrl = imageResults.data[0].url;
      console.log('Image URL', imageUrl);
    }

    // Combine and return the responses
    res.status(200).json({ aiResponse, imageUrl, messages });
  } catch (error) {
    console.log('error', error);
    //res.status(500).json({ error: error });
  } //
});

router.post('/message', async (req, res) => {
  try {
    const { conversationId, messages } = req.body;
    console.log('data', messages, conversationId);
    // Create requestBody with adjusted max_tokens
    const requestBody = {
      messages,
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

    const userMessage = new Message({
      _id: new mongoose.Types.ObjectId(),
      conversation_Id: mongoose.Types.ObjectId(conversationId),
      role: messages[0].role,
      content: messages[0].content,
      created_At: new Date(),
    });

    const aiMessage = new Message({
      _id: new mongoose.Types.ObjectId(),
      conversation_Id: mongoose.Types.ObjectId(conversationId),
      role: 'system',
      content: aiResponse,
      created_At: new Date(),
    });

    const createdUserMessage = await userMessage.save();
    const createdAiMessage = await aiMessage.save();

    await Conversation.updateOne(
      { _id: mongoose.Types.ObjectId(conversationId) },
      { $set: { updated_At: new Date() } }
    );

    res.status(201).json({
      userMessageId: createdUserMessage._id,
      aiMessageId: createdAiMessage._id,
      response: aiResponse,
      date: createdUserMessage.created_At,
      role: 'system',
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

router.get('/messages/:conversationId', async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({ conversation_Id: conversationId });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
router.get('/conversation/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const conversation = await Conversation.find({ user_Id: userId });
    const conversationIds = conversation.map((conv) => conv._id);

    const messages = await Message.find({
      conversation_Id: { $in: conversationIds },
    });
    res.status(200).json(messages);
    // console.log('conversationId', conversationId);
    // res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

module.exports = router;
