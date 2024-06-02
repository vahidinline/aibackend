const express = require('express');
const router = express.Router();
//const fetch = require('node-fetch'); // Ensure you have node-fetch installed
const API_KEY = process.env.OPENAI_API_KEY;
const { OpenAIApi } = require('openai');
const e = require('express');
const { json } = require('body-parser');
const openai = new OpenAIApi(API_KEY); //

require('dotenv').config();

router.post('/', async (req, res) => {
  const userInfo = req.body.data;
  const age = userInfo[10].answer;
  const gender = userInfo[0].answer;
  const goal = userInfo[1].answer;
  const location = userInfo[5].answer;
  const expertise = userInfo[11].answer;
  const equipment = userInfo[6].answer;

  const currentWeight = userInfo[8].answer;
  const height = userInfo[7].answer;
  const targetWeight = userInfo[9].answer;
  const injuries = userInfo[12].answer;
  const bodyPart = userInfo[4].answer;
  const physicalAiming = userInfo[3].answer;
  const dayPerWeek = userInfo[13].answer;

  //const userId = req.body.userId;
  const bodyParts = () => {
    // Extract body part chosen by the user
    const bodyPart = userInfo[4].answer;

    // Array mapping based on the selected body part
    switch (bodyPart) {
      case 'Upper body':
        return [
          'Chest',
          'Shoulders',
          'Upper back',
          'Upper arms',
          'Pectorals',
          'Neck',
        ];
      case 'Full body':
        return [
          'Abs',
          'Chest',
          'Glutes',
          'Leg',
          'Triceps',
          'Abs',
          'Adductors',
          'Back',
          'Biceps',
          'Cardio',
          'Chest',
          'Hamstrings',
          'Lower arms',
          'Lower legs',
          'Neck',
          'Pectorals',
          'Shoulders',
          'Upper arms',
          'Upper back',
          'Upper legs',
          'Waist',
        ];
      case 'Lower body':
        return ['Glutes', 'Leg', 'Adductors', 'Hamstrings', 'Lower legs'];
      case 'Wider back':
        return ['Back', 'Upper back'];
      case 'Bigger chest':
        return ['Chest', 'Pectorals'];
      case 'Boulder shoulders':
        return ['Shoulders', 'Upper arms'];
      case 'Strong Legs':
        return ['Leg', 'Hamstrings'];
      case 'Six pack':
        return ['Abs'];
      default:
        return [
          'Abs',
          'Chest',
          'Glutes',
          'Leg',
          'Triceps',
          'abs',
          'adductors',
          'back',
          'biceps',
          'cardio',
          'chest',
          'hamstrings',
          'lower arms',
          'lower legs',
          'neck',
          'pectorals',
          'shoulders',
          'upper arms',
          'upper back',
          'upper legs',
          'waist',
        ];
    }
  };

  const exercises = await Exercise.find({
    bodypart: { $in: bodyParts().map((part) => new RegExp(part, 'i')) },
    equipment: { $in: equipment.map((eq) => new RegExp(eq, 'i')) },
  }).exec();

  const exerciseNames = exercises.map((exercise) => exercise.name);
  console.log('number of filtered exercises ', exerciseNames.length);
  // const prompt = `User with age ${age} ,  gender ${gender} , to achive ${goal}, with ${injuries} injuries   , physicalAiming ${physicalAiming} ,  ${dayPerWeek} per week
  //   \n\nGenerate details for the workout with  name '${exerciseNames}`;
  const prompt = `User with age ${age}, gender ${gender}, aims to achieve ${goal}, but has ${injuries} injuries. The user's physical aims are ${physicalAiming} and plans to workout ${dayPerWeek} days per week. 

Generate a workout plan for this user who will be exercising ${dayPerWeek} days a week, with no more than 9 exercises each day. 

Take note of the user's targeted exercises: '${exerciseNames}'. `;

  const options = {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-3.5-turbo-1106',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 1000, // Adjust max_tokens as needed
      temperature: 0.2,
    }),
  };

  try {
    const response = await fetch(
      'https://api.openai.com/v1/chat/completions',
      options
    );
    const data = await response.json();

    res.json(data.choices[0].message.content);
    return;
    const openAiResponse = data.choices[0].message.content;

    // Extract valid JSON content using a regular expression
    const jsonContentMatch = openAiResponse.match(/\[.*\]/s);

    if (!jsonContentMatch) {
      throw new Error('Unable to extract valid JSON from OpenAI response');
    }

    // Clean up the JSON content
    const jsonContent = jsonContentMatch[0].replace(/\\n/g, '');

    // Process the cleaned JSON
    const exerciseObjects = JSON.parse(jsonContent);

    // Save user message and OpenAI response to the database (if needed)

    // Update conversation updated time
    conversation.updatedAt = new Date();
    await conversation.save();

    // Transform exerciseObjects into the desired format
    const workoutPlan = {
      sunday: [],
      monday: [],
      wednesday: [],
      friday: [],
    };

    exerciseObjects.forEach((day) => {
      switch (day.day.toLowerCase()) {
        case 'sunday':
          workoutPlan.sunday = day.workout;
          break;
        case 'monday':
          workoutPlan.monday = day.workout;
          break;
        case 'wednesday':
          workoutPlan.wednesday = day.workout;
          break;
        case 'friday':
          workoutPlan.friday = day.workout;
          break;
        // Add more cases for other days if needed
      }
    });

    res.json({ userMessage: userMessage, workoutPlan: workoutPlan });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Error processing your request');
  }
});

router.get('/conversations', async (req, res) => {
  const userId = req.query.userId; // Get userId from query parameters

  if (!userId) {
    res.status(400).send('UserId is required');
    return;
  }

  try {
    const conversations = await Conversation.find({
      participants: userId,
    }).sort({ updatedAt: -1 });
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).send('Error fetching conversations');
  }
});

router.post('/dalle', async (req, res) => {
  const response = await openai.createImage({
    model: 'dall-e-3',
    prompt: 'a white siamese cat',
    n: 1,
    size: '1024x1024',
  });
  image_url = response.data.data[0].url;
  res.json(image_url);
});

module.exports = router;
