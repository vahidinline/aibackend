const ZarinpalCheckout = require('zarinpal-checkout');
const MongoClient = require('mongodb').MongoClient;
const PayTempSchema = require('../models/paymenttemp.model');
const express = require('express');
const bodyParser = require('body-parser');
const User = require('../models/user.model.js');
const app = express();
const router = express.Router();
app.use(bodyParser.json());
const appExpireDate = app.use(bodyParser.json());

router.get('/checker', async (req, res) => {
  const { email } = req.query;
  console.log(email);
  const user = await User.find({ email: email }).lean();

  try {
    const docs = await PayTempSchema.find({ email: email });
    console.log(docs);
    if (docs.length) {
      const paidDoc = docs.find((doc) => doc.paid === true);
      if (paidDoc) {
        // If a paid document is found
        console.log('Paid document found');
        res.json({
          success: true,
          level: user.level,
          product: paidDoc.product,
        });
      } else {
        // If no paid document is found
        res.json({ success: false, message: 'No paid product found' });
      }
    }
  } catch (err) {
    console.log('Database error:', err);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

//middleware to set callbackUrl based on the product purchased
const setCallbackUrl = (product) => {
  switch (product) {
    case 'shapeUpShape up pro 3':
      return 'https://azishafiei.com/callback';

    case 'Shape up Academy':
      return 'https://azishafiei.com/callback';

    case 'Fitlinez app 1-month':
      return 'https://fitlinez.com/callback';

    case 'Fitlinez app 3-month':
      return 'https://fitlinez.com/callback';
      break;
    case 'Fitlinez app 12-month':
      return 'https://fitlinez.com/callback';
      break;
    default:
      return 'https://azishafiei.com/callback';
  }
};

router.post('/rial', async (req, res) => {
  const { email, amount, product, name } = req.body;

  console.log(email, amount, product, name);
  console.log(setCallbackUrl(product));

  // Create a new payment request using Zarinpal API
  const zarinpal = ZarinpalCheckout.create(
    '17c2f64c-4803-4171-847f-66312468ce86',
    false
  );
  const response = await zarinpal.PaymentRequest({
    Amount: amount,
    CallbackURL: setCallbackUrl(product),
    Description: product,
    Email: email,
    name: name,
  });

  if (response.status === 100) {
    const regex = /(\d+)/;
    const match = response.url.match(regex);
    const number = match ? match[1] : null;
    console.log(number);
    const payTemp = new PayTempSchema({
      email: email,
      amount: amount,
      authority: number,
      paid: false,
      product: product,
    });
    payTemp
      .save()
      .then(() => {
        console.log('saved');
      })
      .catch((err) => {
        console.log(err);
      });
    res.json({ success: true, url: response.url });
  } else {
    res.json({ success: false, message: response.message });
    console.log(response);
  }
});

router.post('/callback', (req, res) => {
  const status = req.body.status;
  const authority = req.body.authority;
  console.log('status', status, 'authority', authority);

  if (status == 'OK') {
    PayTempSchema.findOneAndUpdate(
      { authority: authority, paid: false }, // Match authority and unpaid records only
      { paid: true }, // Set paid status to true
      { new: true }, // Return the updated document
      (err, doc) => {
        if (err) {
          console.log('error 72');
        } else if (doc) {
          console.log(`Payment with RefID ${authority} succeeded`);
          console.log(doc);

          const createProduct = (productString) => {
            switch (productString) {
              case 'Shape up pro 3':
                return {
                  name: productString,
                  // create 3 months expiration date
                  expirationDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 3)
                  ),
                };
              case 'Shape up Academy':
                return {
                  name: productString,
                  // create 6 months expiration date
                  expirationDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 6)
                  ),
                };
              case 'Fitlinez app 1-month':
                return {
                  name: productString,
                  // create 1 month expiration date
                  expirationDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 1)
                  ),
                };
              case 'Fitlinez app 3-month':
                return {
                  name: productString,
                  // create 3 months expiration date
                  expirationDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 3)
                  ),
                };
              case 'Fitlinez app 12-month':
                return {
                  name: productString,
                  // create 12 months expiration date
                  expirationDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 12)
                  ),
                };
              default:
                return {
                  name: productString,
                  // create 1 month expiration date
                  expirationDate: new Date(
                    new Date().setMonth(new Date().getMonth() + 1)
                  ),
                };
            }
          };

          const newProduct = createProduct(doc.product);

          User.findOneAndUpdate(
            { email: doc.email },
            {
              level: 4,
              ExpireDate: newProduct.expirationDate,
              isExpired: false,
              $push: { userProduct: newProduct },
            },
            (err, doc) => {
              if (err) {
                console.log('error 90');
              }
              console.log('doc');
            }
          );
          // Additional code for sending email if needed
        } else {
          console.log(
            `Payment with RefID ${authority} not found or already paid`
          );
        }
      }
    );
  } else {
    console.log(`Payment with RefID ${authority} failed`);
  }

  res.status(200).send();
});

module.exports = router;
