const express = require('express');
const multer = require('multer');
const { VertexAI } = require('@google-cloud/vertexai');
const router = express.Router();

const bucketName = 'videofitlinez'; // replace with your bucket name

// Initialize Vertex with your Cloud project and location
const vertex_ai = new VertexAI({
  project: 'ai-model-418317',
  location: 'us-central1',
});
const model = 'gemini-1.0-pro-vision-001';

// Instantiate the models
const generativeModel = vertex_ai.preview.getGenerativeModel({
  model: model,
  generation_config: {
    max_output_tokens: 2048,
    temperature: 0.4,
    top_p: 1,
    top_k: 32,
  },
  safety_settings: [
    {
      category: 'HARM_CATEGORY_HATE_SPEECH',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
    {
      category: 'HARM_CATEGORY_HARASSMENT',
      threshold: 'BLOCK_MEDIUM_AND_ABOVE',
    },
  ],
});

router.post('/', async (req, res) => {
  //const videoPath = req.file.path;

  const user = {
    age: 25,
    gender: 'male',
    height: 175,
    weight: 80,
    fitnessGoal: 'muscle gain',
    fitnessLevel: 'intermediate',
    preferedLocation: 'gym',
    levelOfActivity: 'sedentary',
    preferedDaysPerWeek: '3 days',
  };
  const prompt = `Please generate a personalized workout plan based on the user's information . The output should be in the following JSON format, adhering to the specified requirements:

  {
    "_id": {
      "$oid": ""
    },
    "userId": "",
    "packageId": "",
    "packageName": "",
    "location": "",
    "taskList": [],
    "weeklyPlan": [
      {
        "dayName": "",
        "title": "",
        "exercises": [
          {
            "name": "exercise name",
            "sets": 3,
            "reps": 8-12,
            "rest": 60,
            "description": "description of the exercise"
          }
        ]
      }
    ],
    "date": {
      "$date": "date"
    },
    "__v": 0
  }

  Requirements:

  * _id, userId, packageId: Generate unique random strings for these fields.
  * packageName: Create a descriptive name that reflects the user's fitnessGoal, fitnessLevel, and preferedLocation.
  * location: Set this to the user's preferedLocation.
  * weeklyPlan: The number of objects in this array should match the user's preferedDaysPerWeek.
  * dayName: Each object should have a unique day of the week assigned.
  * title: Provide a brief title describing the muscle groups targeted for that day's workout.
  * exercises: Each day should include a minimum of 5 and a maximum of 10 exercises relevant to the user's fitnessGoal, fitnessLevel, and preferedLocation.
  * exercise details: For each exercise, include:
      * name: The name of the exercise.
      * sets: The number of sets to perform.
      * reps: The number of repetitions per set.
      * rest: The rest time between sets (in seconds).
      * description: A brief description of how to perform the exercise.

  Important Considerations:

  * Exercise Selection: Prioritize exercises that are suitable for the user's fitnessLevel and fitnessGoal and can be performed at the preferedLocation.
  * Exercise Variety: Ensure each day has a mix of exercises targeting different muscle groups.
  * Rep Ranges: Use appropriate rep ranges for muscle gain (typically 8-12 reps) while considering the user's fitnessLevel.
  * Rest Time: Provide adequate rest time between sets to allow for muscle recovery.
  * Output Format: Ensure that the generated JSON is valid and adheres to the specified format.;`;

  // Upload the video to Google Cloud Storage
  // await storage.bucket(bucketName).upload(videoPath, {
  //   gzip: true,
  //   metadata: {
  //     cacheControl: 'public, max-age=31536000',
  //   },
  // });

  // Get the file as a Buffer
  //const file = storage.bucket(bucketName).file(req.file.filename);
  //const [contents] = await file.download();

  // Convert the Buffer to a base64 string
  //const videoBase64 = contents.toString('base64');

  const generateContentReq = {
    contents: [
      {
        role: 'user',
        parts: [
          { text: prompt },
          // { inline_data: { mime_type: 'video/mp4', data: videoBase64 } },
        ],
      },
    ],
  };

  const streamingResp = await generativeModel.generateContentStream(
    generateContentReq
  );

  let aggregatedResponse = '';
  for await (const item of streamingResp.stream) {
    aggregatedResponse += JSON.stringify(item);
  }

  res.send(
    'aggregated response: ' + JSON.stringify(await streamingResp.response)
  );
});

module.exports = router;
