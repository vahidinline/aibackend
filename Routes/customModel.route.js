const express = require('express');
const axios = require('axios');
const { GoogleAuth } = require('google-auth-library');

const app = express();
const router = express.Router();

// Replace these with your actual values
const ENDPOINT_ID = '4056148972400541696';
const PROJECT_ID = '350430681081';
const KEY_FILE_PATH = './config/key.json';

// Initialize GoogleAuth client
const auth = new GoogleAuth({
  keyFile: KEY_FILE_PATH,
  scopes: 'https://www.googleapis.com/auth/cloud-platform',
});

// Get the auth token
const getAuthToken = async () => {
  const client = await auth.getClient();
  const tokenResponse = await client.getAccessToken();
  return tokenResponse.token;
};

// Middleware to parse JSON request bodies
app.use(express.json());

// Define the API endpoint
router.post('/', async (req, res) => {
  const url = `https://us-central1-aiplatform.googleapis.com/v1/projects/${PROJECT_ID}/locations/us-central1/endpoints/${ENDPOINT_ID}:predict`;
  const authToken = await getAuthToken(); // Ensure to `await` here
  const inputData = req.body;

  try {
    const response = await axios.post(url, inputData, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        'Content-Type': 'application/json',
      },
    });

    // Send response back to client
    res.json(response.data);
  } catch (error) {
    console.error(
      'Error making prediction:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.use('/predict', router);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = router;
