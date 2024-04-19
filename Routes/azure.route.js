const axios = require('axios');
const express = require('express');
const router = express.Router();
const User = require('../models/user.model.js');
const AiChatConversation = require('../models/aiChatConversation.model');
const AiChatUsage = require('../models/aiChatUsage.model');
const endpoint = process.env['AZURE_ENDPOINT'];
const azureApiKey = process.env['AZURE_KEY'];

router.post('/', async (req, res) => {
  const { messages, userId, exerciseId, title, userLanguage } = req.body;
  try {
    // Get user level from the User model
    const user = await User.findById(userId);
    if (!user) {
      return res.status(403).json({ error: 'User not found' });
    }

    // Determine user type based on the level
    const userType = user.level === 4 ? 'premium' : 'free';

    // Calculate max tokens based on user type
    const maxTokens = userType === 'premium' ? 80000 : 200;
    const isLimitExceeded = await checkDailyUsageLimit(userId, maxTokens);
    if (isLimitExceeded) {
      return res.status(403).json({ error: 'Daily usage limit exceeded' });
    }

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

    // Make the request to OpenAI API
    const response = await axios.post(`${endpoint}`, requestBody, {
      headers: {
        Authorization: `Bearer ${azureApiKey}`,
      },
    });
    const responseData = {
      id: response.data.id,
      model: response.data.model,
      choices: response.data.choices.map((choice) => ({
        finish_reason: choice.finish_reason,
        index: choice.index,
        message: choice.message,
        content_filter_results: choice.content_filter_results,
      })),
      usage: response.data.usage,
    };

    // Return the extracted data to the user

    // Log usage details to MongoDB
    const usageDetails = await AiChatUsage.create({
      userId: userId,
      userType: userType,
      tokensUsed: response.data.usage.total_tokens,
      requestDetails: requestBody, // Store additional request details if needed
    });

    // Log conversation details to MongoDB
    const conversationDetails = await AiChatConversation.create({
      userId: userId,
      userType: userType,
      timestamp: usageDetails.timestamp,
      input: messages[0].content,
      output: response.data.choices[0].message.content,
      tokensUsed: response.data.usage.total_tokens,
      conversationDetails: {
        // Additional details about the conversation if needed
        exerciseId,
        title,
        userLanguage,
      },
    });
    // Return the extracted data to the user
    res.json(conversationDetails);

    // Return the AI chat response to the user
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error });
  }
});

async function checkDailyUsageLimit(userId, maxTokens) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usageSum = await AiChatUsage.aggregate([
    {
      $match: {
        userId: userId,
        timestamp: { $gte: today },
      },
    },
    {
      $group: {
        _id: null,
        totalTokens: { $sum: '$tokensUsed' },
      },
    },
  ]);

  return usageSum.length > 0 && usageSum[0].totalTokens >= maxTokens;
}

router.get('/usage/:userId', async (req, res) => {
  const userId = req.params.userId;
  console.log(userId);

  try {
    // Check daily usage
    const dailyUsage = await checkDailyUsage(userId);

    const userLimit = () => {
      const user = User.findById(userId);
      return user.level === 4 ? 80000 : 100;
    };

    const usagePercentage = (dailyUsage / userLimit()) * 100;

    const userLimitExceeded = dailyUsage >= userLimit();

    res.json({ dailyUsage, userLimitExceeded, usagePercentage });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Function to check daily usage
async function checkDailyUsage(userId) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const usageSum = await AiChatUsage.aggregate([
    {
      $match: {
        userId: userId,
        timestamp: { $gte: today },
      },
    },
    {
      $group: {
        _id: null,
        totalTokens: { $sum: '$tokensUsed' },
      },
    },
  ]);

  return usageSum.length > 0 ? usageSum[0].totalTokens : 0;
}

//update userRate in AIChatConversation model

router.put('/rate/:id', async (req, res) => {
  const { id } = req.params;
  const { userRate } = req.body;

  console.log(id, userRate);
  try {
    const conversation = await AiChatConversation.findById(id);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    conversation.userRate = userRate;
    await conversation.save();
    res.json(conversation);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
