const express = require('express');
const PaymentStripe = require('./Routes/PaymentStripe.js');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const cookieSession = require('cookie-session');
const app = express();
const initializeBot = require('./Routes/telegramBot.route.js');
var Bugsnag = require('@bugsnag/js');
var BugsnagPluginExpress = require('@bugsnag/plugin-express');

// Initialize the Telegram bot
const bot = initializeBot();

// Body parser middleware
app.use(bodyParser.json());

// Start the bot
bot.launch();

Bugsnag.start({
  apiKey: '76ba41ec78cd787eeb0eb7b7dab64d3f',
  plugins: [BugsnagPluginExpress],
});
var middleware = Bugsnag.getPlugin('express');
const AuthRoute = require('./Routes/Auth.route.js');
const Reminder = require('./Routes/ReminderRoute.js');
const StripeSubscribe = require('./Routes/stripeSubscribe.js');
const StripeWorkShop = require('./Routes/stripeworkshop.route.js');
const Push = require('./Routes/push.js');
const SinglePush = require('./Routes/singlePush.js');
// const Email = require('./Routes/email.route.js');
const Zarinpal = require('./Routes/zarinpal.js');
const Price = require('./Routes/appPrice.route.js');
const Gpts = require('./Routes/gpts.js');
const Product = require('./Routes/Product.route.js');
const FitlinezChatBot = require('./Routes/azure.route.js');
const aiConversation = require('./Routes/conversation.route.js');
const Gemini = require('./Routes/Gemini.route.js');
const B2BTest = require('./Routes/b2bTest.route.js');
const GeminifoodData = require('./Routes/vertex.js');
const New = require('./Routes/new.js');
const NutritionExtractor = require('./Routes/nutritionExtractor.route.js');
const AudioConvertor = require('./Routes/convertAudioToText.route.js');
const CustomLLM = require('./Routes/customModel.route.js');
const MealSelection = require('./Routes/Meal.route.js');
var cron = require('node-cron');

// const { Configuration, OpenAIApi } = require('openai');
//const UserWorkoutHistoryRoute = require('./Routes/userWorkoutHistoryRoute.js');
require('dotenv').config();
app.use(middleware.requestHandler);
app.use(middleware.errorHandler);

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(
  cors({
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
  })
);

app.use(express.json());
app.use(
  cookieSession({
    name: 'fitlinez-session',
    secret: 'COOKIE_SECRET',
    httpOnly: true,
  })
);

//console.log(process.env);
const db = require('./models/index.js');
const { GenerativeModel } = require('@google-cloud/vertexai');

db.mongoose
  .connect(
    `mongodb+srv://vahid_:${process.env.PASS}@cluster0.minxf.mongodb.net/${process.env.DB}`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log('Successfully connect to MongoDB.');
  })
  .catch((err) => {
    console.error('Connection error', err);
    process.exit();
  });

app.get('/', (req, res) => {
  res.json({ message: 'AI BackEnd' });
});

// cron.schedule('*/* 12 * * *', async () => {
//   try {
//     // Find users with ExpireDate less than or equal to the current date
//     const currentDate = new Date();
//     const expiredUsers = await User.find({ ExpireDate: { $lte: currentDate } });
//     console.log(expiredUsers);
//     // Update user levels to 0
//     await Promise.all(
//       expiredUsers.map(async (user) => {
//         await User.findByIdAndUpdate(user._id, { level: 0, isExpired: true });
//         console.log(`User Level & isExpired Updated for user ${user._id}`);
//       })
//     );

//     console.log('Cron job completed successfully');
//   } catch (error) {
//     console.error(error);
//   }
// });

app.use('/', AuthRoute);
app.use('/create-checkout-session', PaymentStripe);
app.use('/app/create-checkout-session', PaymentStripe);
app.use('/stripeworkshop', StripeWorkShop);
app.use('/subscription', StripeSubscribe);
app.use('/reminder', Reminder);
app.use('/push', Push);
app.use('/singlepush', SinglePush);
app.use('/zarinpal', Zarinpal);
app.use('/price', Price);
app.use('/gpts', Gpts);
app.use('/fitlinez-chat-bot', FitlinezChatBot);
app.use('/Productlist', Product);
app.use('/aiconversation', aiConversation);
app.use('/gemini', Gemini);
app.use('/test', B2BTest);
app.use('/query', GeminifoodData);
app.use('/new', New);
app.use('/nutritionextractor', NutritionExtractor);
app.use('/audioconvertor', AudioConvertor);
app.use('/vertex', CustomLLM);
app.use('/mealselection', MealSelection);
const PORT = process.env.PORT || 8090;
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
