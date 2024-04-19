const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const User = require('../models/user.model.js');

require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE);

router.post('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  // Request headers you wish to allow
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);
  const { email, amount, name, product } = req.body;
  console.log(email, amount, name, product);

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: product,
            },
            unit_amount: amount * 100,
          },

          quantity: 1,
        },
      ],

      success_url: `https://fitlinez.com/successful-payment/?email=${email}&name=${name}&product=${product}`,
      cancel_url: `https://fitlinez.com/unsuccessful-payment/?email=${email}`,
    });

    // const request = mailjet.post('send').request({
    //   FromEmail: 'info@fitlinez.com',
    //   FromName: 'فیتلاینز',
    //   Subject: 'رزرو مشاوره کوچینگ تغذیه',
    //   'Html-part': ` <p> عزیز</p>
    //   <p>با تشکر از اینکه از خدمات ما استفاده می کنید</p>
    //   <p>بزودی برای تعیین ساعت مشاوره با شما تماس گرفته می شود</p>`,
    //   Recipients: [{ Email: email }],
    // });

    res.json({ url: session.url });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// endpoint for successful payment
router.get('/successful-payment', async (req, res) => {
  const { email, product } = req.query;
  console.log(email, product);
  try {
    // update user level in the database
    const user = await User.findOne({ email });
    if (user) {
      user.level = 4;
      user.userProduct.push({
        name: product,
        expirationDate:
          product === 'shape up with Azar'
            ? new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      });
      await user.save();
      console.log('user level', user.level);
    }

    // send confirmation email
    const request = mailjet
      .post('send', { version: 'v3.1' })
      .request({
        Messages: [
          {
            From: {
              Email: 'noreply@fitlinez.com',
              Name: 'Azar from Fitlinez',
            },
            To: [
              {
                Email: email,
              },
            ],
            TemplateID: 4827358,
            TemplateLanguage: true,
            Subject: 'پرداخت شما با موفقیت انجام شد',
            Variables: {
              product: product,
            },
          },
        ],
      })
      .then((result) => {
        console.log(result.body);
        res.send('Payment successful.');
      })
      .catch((err) => {
        console.log('Error sending confirmation email', err);
        res.send('Payment successful. Error sending confirmation email.');
      });
  } catch (err) {
    console.log('Error updating user level', err);
    res.send('Payment successful. Error updating user level.');
  }
});
module.exports = router;
