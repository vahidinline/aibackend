const { Telegraf, Markup } = require('telegraf');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const endpoint = process.env['AZURE_ENDPOINT'];
const azureApiKey = process.env['AZURE_KEY'];
const openai = require('openai');
const { default: axios } = require('axios');
const UserInteractionModel = require('../models/userFoodConsumed.model');
const UserModel = require('../models/botUser.model');
const NutritionSchema = require('../models/mealNutrition.model');
openai.apiKey = process.env.OPENAI_API_KEY;
const getNutrition = require('../middleware/getNutrition');

// Function to convert JSON to HTML table
function jsonToHtmlTable(json) {
  console.log('json in html', json);
  let html = '';

  // Add meal name
  html += `*Meal Name*: Breakfast\n`;

  // Add amounts
  json.meal?.forEach(({ name, amount }) => {
    html += `*${name}*: ${amount}\n`;
  });

  return html;
}

const initializeBot = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);
  //storing user into database with this schema  userId: Number, username: String,
  //listening for the start command from telegram bot
  // Command: /start
  // bot.hears(/\/start/, async (msg) => {
  //   const newUser = new UserModel({
  //     userId: msg.from.id,
  //     username: msg.from.username,
  //   });
  //   await newUser.save();
  //   //  await bot.telegram.sendMessage(msg.chat.id, 'Welcome to the bot!');
  //   await bot.telegram.sendMessage(msg.chat.id, 'Welcome to the bot!');
  //   //provide options to users to select
  //   await bot.telegram.sendMessage(msg.chat.id, 'Please select an option:', {
  //     reply_markup: {
  //       keyboard: [
  //         ['Option 1', 'Option 2'],
  //         ['Option 3', 'Option 4'],
  //       ],
  //       resize_keyboard: true,
  //       one_time_keyboard: true,
  //     },
  //   });
  //   bot.on('text', async (ctx) => {
  //     const userOption = ctx.message.text;
  //     console.log('User option:', userOption);
  //     // Store user option in state

  //     await bot.telegram.sendMessage(
  //       msg.chat.id,
  //       `You selected: ${userOption}`
  //     );

  //     // Continue with the rest of the code
  //     // ...
  //   });
  // });
  // Store user option in state

  bot.on('text', async (ctx) => {
    const userText = ctx.message.text;
    console.log('User text:', userText);
    try {
      const requestBody = {
        messages: [
          {
            role: 'user',
            content: `Please return a json format of extracted meal name and the amount in gram or whatever user inputed. if the input is not in english, translate it to english: ${userText}`,
          },
        ],
        temperature: 0.3,
        top_p: 0.7,
        frequency_penalty: 0,
        presence_penalty: 0,
        max_tokens: 4000,
        stop: null,
      };
      //store user input and ai response into database with this schema userId, username, userText , aiResponse,date, approvedbyuser

      // console.log('Request body:', requestBody);

      const response = await axios.post(`${endpoint}`, requestBody, {
        headers: {
          Authorization: `Bearer ${azureApiKey}`,
        },
      });

      const aiResponse = response.data.choices[0].message['content'];
      const newInteraction = new UserInteractionModel({
        userId: ctx.from.id,
        username: ctx.from.username,
        userText: userText,
        aiResponse: aiResponse,
        approvedbyuser: false, // this will be updated later
      });
      await newInteraction.save();
      try {
        const jsonResponse = JSON.parse(aiResponse);
        console.log('AI response:', jsonResponse);
        htmlTable = jsonToHtmlTable(jsonResponse);
      } catch (error) {
        console.error('Error parsing AI response:', error);
        htmlTable = 'Could not parse AI response.';
      }

      ctx.replyWithMarkdown(
        `${htmlTable}\n\nIs this correct?`,
        Markup.inlineKeyboard([
          Markup.button.callback('yes', 'YES'),
          Markup.button.callback('no', 'NO'),
        ])
      );
      //if user approved, update the database with approvedbyuser = true. if not , ask for the correct input
      // console.log('AI response:', aiResponse);
    } catch (error) {
      console.error('Error handling message:', error);
      ctx.reply('Error handling message. Please try again later.');
    }
  });

  bot.action('YES', async (ctx) => {
    // Find the most recent approved interaction by this user
    const recentInteraction = await UserInteractionModel.findOne({
      userId: ctx.from.id,
      //approvedbyuser: true,
    }).sort('-date');

    // Check if the interaction exists
    if (recentInteraction) {
      console.log('User confirmed', recentInteraction);

      // Extract ingredients from AI response
      const aiResponse = JSON.parse(recentInteraction.aiResponse);
      const ingredients = aiResponse.meal_items.map((item) => item.name); // Corrected line

      // Send the ingredients to the nutrition API
      try {
        const nutritionInfoNested = await getNutrition(ingredients);
        console.log('Nutrition info:', nutritionInfoNested);

        // Flatten the array of arrays
        const nutritionInfo = nutritionInfoNested.flat();

        // Update mealNutrition field in the recentInteraction
        recentInteraction.mealNutrition = [
          {
            meal_name: aiResponse.meal_name,
            ingredients: nutritionInfo, // Assign the flattened array
          },
        ];

        await recentInteraction.save();
      } catch (error) {
        console.error('Error getting nutrition info:', error);
      }
    }
  });
  // bot.action('NO', (ctx) => {
  //   console.log('User did not confirm');
  //   ctx.reply("I see that you did not confirm. Let's try again.");
  //   // Do something when the user does not confirm
  // });

  return bot;
};

module.exports = initializeBot;
