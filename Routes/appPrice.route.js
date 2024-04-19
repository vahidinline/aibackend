const express = require('express');
const router = express.Router();
const AppPriceSchema = require('../models/appPrice.model.js');

require('dotenv').config();

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
  const {
    title,
    price,
    description,
    currency,
    priceType,
    priceTier,
    sign,
    priceDisplay,
  } = req.body;
  const newPrice = new AppPriceSchema({
    title,
    price,
    description,
    currency,
    priceType,
    priceTier,
    sign,
    priceDisplay,
  });
  try {
    await newPrice.save();
    res.status(201).json(newPrice);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
});

router.get('/', async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, OPTIONS, PUT, PATCH, DELETE'
  );

  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With,content-type'
  );

  res.setHeader('Access-Control-Allow-Credentials', true);

  //get all tickets
  const tickets = await AppPriceSchema.find({ active: true });
  console.log(tickets);
  res.json(tickets);
});

module.exports = router;
