const express = require('express');
const multer = require('multer');
const FormData = require('form-data');
const fs = require('fs');
const axios = require('axios');

const app = express();
const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post('/api/upload', upload.single('file'), async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  try {
    // Prepare the file to be sent to Azure OpenAI
    const fileStream = fs.createReadStream(req.file.path);
    const formData = new FormData();
    formData.append('file', fileStream);

    // Azure API URL
    const azureUrl = `https://workoutgenerator.openai.azure.com/openai/deployments/speechFoodRec/audio/transcriptions?api-version=2024-02-01`;

    // Sending the file to Azure OpenAI
    const response = await axios.post(azureUrl, formData, {
      headers: {
        'api-key': 'a4b23a99be8d4a688d93a33066d7aaa4',
        ...formData.getHeaders(),
      },
    });

    if (response.status !== 200) {
      throw new Error(`Error from Azure OpenAI: ${response.statusText}`);
    }

    const data = response.data;

    // Clean up: remove the temporary file
    fs.unlinkSync(req.file.path);

    // Send the transcription back to the client
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error('Failed to process and send file:', error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;

// const express = require('express');
// const multer = require('multer');
// const { SpeechClient } = require('@google-cloud/speech');
// const fs = require('fs');
// const app = express();
// const router = express.Router();

// // Google Cloud Speech-to-Text client
// const speechClient = new SpeechClient();

// // Multer storage for handling file uploads
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// // Route for handling file uploads and speech-to-text conversion
// router.post('/api/upload', upload.single('file'), async (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }
//   console.log('req.file', req.file);
//   try {
//     // Read the uploaded audio file
//     const fileStream = fs.createReadStream(req.file.path);

//     // Configure the speech recognition request
//     const config = {
//       encoding: 'LINEAR16', // Adjust encoding as needed
//       sampleRateHertz: 44100, // Adjust sample rate as needed
//       languageCode: 'en-US', // Adjust language code as needed
//     };

//     // Create the audio object for the request
//     const audio = {
//       content: fileStream, // Use the file stream directly
//     };

//     // Perform speech recognition
//     const [response] = await speechClient.recognize(config, audio);

//     // Extract the transcript from the response
//     const transcript = response[0].alternatives[0].transcript;

//     // Clean up: remove the temporary file
//     fs.unlinkSync(req.file.path);
//     console.log(transcript);
//     // Send the transcription back to the client
//     res.json({ transcript });
//   } catch (error) {
//     console.error('Failed to process and send file:', error.message);
//     res.status(500).send('Internal Server Error');
//   }
// });

// module.exports = router;
