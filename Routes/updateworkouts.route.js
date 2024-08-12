// const express = require('express');
// const Exercise = require('../models/workouts.model');
// const router = express.Router();
// const axios = require('axios');

// // OpenAI API endpoint and key
// const openAiEndpoint = process.env.OPENAI_FOOD_API_ENDPOINT;
// const openAiApiKey = process.env.OPENAI_FOOD_API_KEY; // Ensure this is correct and securely stored

// router.post('/', async (req, res) => {
//   try {
//     const exercises = await Exercise.find();

//     const errorMessages = []; // Collect error messages

//     for (const exercise of exercises) {
//       try {
//         // Construct prompt for AI
//         const prompt = `Please update the following exercise details based on the exercise name:

//         Exercise Name: ${exercise.name}

//         Possible Values:
//           MainTarget: ${Exercise.schema.paths.mainTarget.options.enum.join(
//             ', '
//           )}
//           OtherTarget: ${Exercise.schema.paths.otherTarget.options.enum.join(
//             ', '
//           )}
//           CategoryMuscle: ${Exercise.schema.paths.categoryMuscle.options.enum.join(
//             ', '
//           )}
//           Level: ${Exercise.schema.paths.level.options.enum.join(', ')}
//           MuscleType: ${Exercise.schema.paths.muscleType.options.enum.join(
//             ', '
//           )}
//           Equipment: ${Exercise.schema.paths.equipment.options.enum.join(', ')}

//         Provide the updated details in JSON format, similar to this example:
//         {
//           "mainTarget": "Chest",
//           "otherTarget": "Triceps",
//           "categoryMuscle": "upper body",
//           "level": "Beginner",
//           "muscleType": "Compound",
//           "equipment": "Dumbbells"
//         }`;

//         // Send prompt to OpenAI API
//         const messages = [{ role: 'system', content: prompt }];
//         const requestBody = {
//           messages,
//           temperature: 0.7,
//           top_p: 0.95,
//           frequency_penalty: 0,
//           presence_penalty: 0,
//           max_tokens: 800,
//           stop: null,
//         };

//         const response = await axios.post(openAiEndpoint, requestBody, {
//           headers: {
//             'Content-Type': 'application/json',
//             Authorization: `Bearer ${openAiApiKey}`,
//           },
//         });

//         // Parse AI response and update exercise
//         try {
//           const updatedData = JSON.parse(
//             response.data.choices[0].message.content
//           );

//           // Validate and correct fields based on schema enums
//           if (
//             !Exercise.schema.paths.mainTarget.options.enum.includes(
//               updatedData.mainTarget
//             )
//           ) {
//             console.warn(
//               `Invalid mainTarget for exercise '${exercise.name}'. Using existing value.`
//             );
//             updatedData.mainTarget = exercise.mainTarget; // Keep existing value if invalid
//           }
//           // Validate other fields similarly

//           // Update exercise in the database
//           await Exercise.findByIdAndUpdate(exercise._id, updatedData);
//           console.log(`Exercise '${exercise.name}' updated successfully.`);
//         } catch (error) {
//           console.error(
//             `Error parsing AI response for exercise '${exercise.name}':`,
//             error
//           );
//           errorMessages.push(
//             `Error parsing AI response for exercise '${exercise.name}': ${error.message}`
//           );
//         }
//       } catch (err) {
//         console.error(`Error updating exercise '${exercise.name}':`, err);
//         errorMessages.push(
//           `Error updating exercise '${exercise.name}': ${err.message}`
//         );
//       }
//     }

//     if (errorMessages.length > 0) {
//       res.status(500).json({ errors: errorMessages });
//     } else {
//       res.json({ message: 'Exercises updated successfully' });
//     }
//   } catch (error) {
//     console.error('Error updating exercises:', error);
//     res.status(500).json({ error: 'Failed to update exercises' });
//   }
// });

// module.exports = router;

// const express = require('express');
// const Exercise = require('../models/workouts.model');
// const router = express.Router();
// const axios = require('axios');
// const { GoogleGenerativeAI } = require('@google/generative-ai');

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
// router.post('/', async (req, res) => {
//   try {
//     const exercises = await Exercise.find();

//     const errorMessages = []; // Collect error messages

//     for (const exercise of exercises) {
//       try {
//         // Construct prompt for AI
//         const prompt = `Please update the following exercise details based on the exercise name:

//         Exercise Name: ${exercise.name}

//         Possible Values:
//           MainTarget: ${Exercise.schema.paths.mainTarget.options.enum.join(
//             ', '
//           )}
//           OtherTarget: ${Exercise.schema.paths.otherTarget.options.enum.join(
//             ', '
//           )}
//           CategoryMuscle: ${Exercise.schema.paths.categoryMuscle.options.enum.join(
//             ', '
//           )}
//           Level: ${Exercise.schema.paths.level.options.enum.join(', ')}
//           MuscleType: ${Exercise.schema.paths.muscleType.options.enum.join(
//             ', '
//           )}
//           Equipment: ${Exercise.schema.paths.equipment.options.enum.join(', ')}

//         Provide the updated details in JSON format, similar to this example:
//         {
//           "mainTarget": "Chest",
//           "otherTarget": "Triceps",
//           "categoryMuscle": "upper body",
//           "level": "Beginner",
//           "muscleType": "Compound",
//           "equipment": "Dumbbells"
//         }`;

//         // Send prompt to OpenAI API

//         const result = await model.generateContent(prompt);
//         const response = result.response;
//         const text = response.text();
//         console.log('text', text);
//         const updatedData = JSON.parse(text);
//         // Update exercise in the database
//         console.log('updatedData', updatedData);
//         return;
//         await Exercise.findByIdAndUpdate(exercise._id, updatedData);
//       } catch (err) {
//         console.error(`Error updating exercise '${exercise.name}':`, err);
//         errorMessages.push(
//           `Error updating exercise '${exercise.name}': ${err.message}`
//         );
//       }
//     }

//     if (errorMessages.length > 0) {
//       res.status(500).json({ errors: errorMessages });
//     } else {
//       res.json({ message: 'Exercises updated successfully' });
//     }
//   } catch (error) {
//     console.error('Error updating exercises:', error);
//     res.status(500).json({ error: 'Failed to update exercises' });
//   }
// });

// module.exports = router;

const express = require('express');
const Exercise = require('../models/workouts.model');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

router.post('/', async (req, res) => {
  try {
    const exercises = await Exercise.find();
    const errorMessages = [];

    for (const exercise of exercises) {
      try {
        const prompt = `Please update the following exercise details based on the exercise name:

        Exercise Name: ${exercise.name}

        Possible Values:
          MainTarget: ${Exercise.schema.paths.mainTarget.options.enum.join(
            ', '
          )}
          OtherTarget: ${Exercise.schema.paths.otherTarget.options.enum.join(
            ', '
          )}
          CategoryMuscle: ${Exercise.schema.paths.categoryMuscle.options.enum.join(
            ', '
          )}
          Level: ${Exercise.schema.paths.level.options.enum.join(', ')}
          MuscleType: ${Exercise.schema.paths.muscleType.options.enum.join(
            ', '
          )}
          Equipment: ${Exercise.schema.paths.equipment.options.enum.join(', ')}

        Provide the updated details in JSON format, similar to this example:
        {
          "mainTarget": "Chest",
          "otherTarget": "Triceps",
          "categoryMuscle": "upper body",
          "level": "Beginner",
          "muscleType": "Compound",
          "equipment": "Dumbbells"
        }`;

        // Generate content from the AI model
        const result = await model.generateContent(prompt);
        const response = result.response;
        let text = response.text();

        // Remove potential formatting artifacts
        text = text.replace(/```json|```/g, '').trim();

        // Parse the cleaned-up JSON string
        const updatedData = JSON.parse(text);

        // Update exercise in the database
        await Exercise.findByIdAndUpdate(exercise._id, updatedData);
      } catch (err) {
        console.error(`Error updating exercise '${exercise.name}':`, err);

        // If an error occurs, set the status to 'Draft'
        await Exercise.findByIdAndUpdate(exercise._id, { status: 'Draft' });

        errorMessages.push(
          `Error updating exercise '${exercise.name}': ${err.message}`
        );
      }
    }

    if (errorMessages.length > 0) {
      res.status(500).json({ errors: errorMessages });
    } else {
      res.json({ message: 'Exercises updated successfully' });
    }
  } catch (error) {
    console.error('Error updating exercises:', error);
    res.status(500).json({ error: 'Failed to update exercises' });
  }
});

module.exports = router;
