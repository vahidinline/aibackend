const express = require('express');
//const fetch = require('node-fetch');
const app = express();
const router = express.Router();

router.post('/', async (req, res) => {
  // Get the base64 encoded audio file from the request body
  const audioFile = req.body.audio;

  // Decode the base64 audio file to a Buffer
  const base64Audio = audioFile.replace(/^data:audio\/\w+;base64,/, '');

  const audioBuffer = Buffer.from(base64Audio, 'base64');
  console.log(audioBuffer);

  // Create a Blob-like object from the Buffer
  const audioBlob = {
    buffer: audioBuffer,
    type: 'audio/webm', // Adjust the MIME type as needed
    size: audioBuffer.length,
  };

  // Create a FormData object and append the audio file
  const formData = new FormData();
  formData.append('file', audioBlob, 'audio.webm'); // Adjust the file name and extension as needed

  // Send the decoded audio file to another server
  try {
    // const response = await fetch('YOUR_OTHER_SERVER_URL', {
    //   method: 'POST',
    //   body: formData,
    // });
    const result = await response.json();

    // Send the response from the other server back to the client
    res.json(result);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      error:
        'An error occurred while sending the audio file to the other server.',
    });
  }
});

module.exports = router;
