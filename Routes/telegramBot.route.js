const { Telegraf, Markup } = require('telegraf');
const { OpenAIClient, AzureKeyCredential } = require('@azure/openai');
const endpoint = process.env['AZURE_ENDPOINT'];
const azureApiKey = process.env['AZURE_KEY'];
const openai = require('openai');
const { default: axios } = require('axios');
const UserInteractionModel = require('../models/userFoodConsumed.model');
const UserModel = require('../models/botUser.model');
const NutritionSchema = require('../models/mealNutrition.model');
const MealModel = require('../models/meal.model');
const ErrorModel = require('../models/error.model');
openai.apiKey = process.env.OPENAI_API_KEY;
const getNutrition = require('../middleware/getNutrition');
const sumUpFunc = require('../middleware/sumUp');
const aiRequestOpenAi = require('../middleware/aiRequestOpenAi');
const jsonToHtmlTable = require('../middleware/jsonToTable');

const initializeBot = () => {
  const bot = new Telegraf(process.env.BOT_TOKEN);

  // Start command and meal selection
  bot.start(async (ctx) => {
    await ctx.reply(
      'Welcome to the Nutrition Bot! Please select an option:',
      Markup.keyboard([
        ['Breakfast'],
        ['Lunch'],
        ['Dinner'],
        ['Snack'],
        ['Daily Report'],
      ]).resize()
    );
  });
  bot.hears('Daily Report', async (ctx) => {
    // Call your another function here
    await sumUpFunc(ctx);
  });
  // Handle meal selection and store in MongoDB
  bot.hears(/Breakfast|Lunch|Dinner|Snack/, async (ctx) => {
    const meal = ctx.message.text;
    const res = await MealModel.create({
      userId: ctx.from.id,
      meal_name: meal,
    });
    const MealId = res._id;
    await UserInteractionModel.create({ userId: ctx.from.id, meal, MealId });

    //return MealModel id
    await ctx.reply(
      `You selected: ${meal}. Please enter the foods and amounts you ate (e.g., "2 eggs, 1 cup oatmeal"):`
    );
  });

  // Process food input and send to OpenAI API
  bot.on('text', async (ctx) => {
    const userText = ctx.message.text;
    const interaction = await UserInteractionModel.findOne({
      userId: ctx.from.id,
    }).sort({ _id: -1 });

    try {
      const aiResponse = await aiRequestOpenAi(userText);
      interaction.aiResponse = aiResponse;

      await interaction.save();
      //check if amount is empty
      if (aiResponse.includes('amount') === 'N/A') {
        ctx.reply('Please enter the foods and amounts again.');
        return;
      }
      const jsonResponse = JSON.parse(aiResponse);
      console.log('jsonResponse', jsonResponse);
      const htmlTable = jsonToHtmlTable(jsonResponse);

      ctx.replyWithMarkdown(
        `${htmlTable}\n\nIs this correct?`,
        Markup.inlineKeyboard([
          Markup.button.callback('Yes', 'YES'),
          Markup.button.callback('No', 'NO'),
        ])
      );
    } catch (error) {
      console.error('Error handling message:', error);
      ctx.reply('Error handling message. Please try again later.');
      //save error message to db ErrorModel for debugging
      await ErrorModel.create({
        message: error.message,
        code: error.code,
        userId: ctx.from.id,
      });
    }
  });

  bot.action('YES', async (ctx) => {
    const interaction = await UserInteractionModel.findOne({
      userId: ctx.from.id,
    }).sort({ _id: -1 });
    const aiResponse = JSON.parse(interaction.aiResponse);
    const ingredients = [aiResponse.meal_name].map((item) => item);
    const amount = [aiResponse.amount].map((item) => item);

    try {
      const nutritionInfo = await getNutrition(ingredients, amount);
      console.log(nutritionInfo);
      const res = await MealModel.findByIdAndUpdate(
        interaction.MealId,
        { meal: nutritionInfo },
        { new: true }
      );
      ctx.reply('Nutrition information saved!');
    } catch (error) {
      ctx.reply('Error getting nutrition information. Please try again later.');
      //save error message to db ErrorModel for debugging
      await ErrorModel.create({
        message: error.message,
        code: error.code,
        userId: ctx.from.id,
      });
    }
  });

  bot.action('NO', (ctx) => {
    ctx.reply(
      "I see that you didn't confirm. Please enter the foods and amounts again."
    );
  });

  return bot;
};

module.exports = initializeBot;
