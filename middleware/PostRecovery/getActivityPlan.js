// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const isJsonValid = require('is-valid-json');
// const PatientActivityPlan = require('../../models/PatientActivityPlan.model');
// const Exercise = require('../../models/workouts.model');

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// const getActivityPlanGemini = async (userInput) => {
//   const {
//     _id,
//     firstName,
//     lastName,
//     dateOfBirth,
//     sex,
//     weight,
//     height,
//     pastSurgeries,
//     reasonOfHospitalization,
//     medicalNotes,
//     activityLevel,
//   } = userInput;
//   console.log('userInput', _id.toHexString());

//   const exercisesList = await Exercise.find(
//     {

//     }
//   )

//   // Calculate age (rough estimate)
//   const birthYear = new Date(dateOfBirth).getFullYear();
//   const currentYear = new Date().getFullYear();
//   const age = currentYear - birthYear;

//   const prompt = `
//   **Patient Information:**
//   * **Name:** ${firstName} ${lastName}
//   * **Age:** ${age}
//   * **Sex:** ${sex}
//   * **Weight:** ${weight} kg
//   * **Height:** ${height} cm
//   * **Activity Level:** ${activityLevel}
//   * **Past Surgeries:** ${pastSurgeries}
//   * **Reason for Hospitalization:** ${reasonOfHospitalization}
//   * **Medical Notes:** ${medicalNotes}

//   **Generate Activity Plan:**
//   Create a personalized activity plan for this patient. Consider their age, sex, weight, height, past surgeries, reason for hospitalization, activity level, and any limitations mentioned in the medical notes.

//   **Output Format:**
//   Please structure the output as a JSON object with the following format. This is a sample exercise structure:

//   {
//     "activityPlan": [
//       {
//         "day": 1,
//         "exercises": [
//           {
//             "name": "Warm-up",
//             "description": "Light cardio and dynamic stretching",

//             "notes": "Focus on gentle movements to prepare your body for exercise"
//           },
//           {
//             "name": "Squat Variations",
//             "description": "Choose from wall sits, chair squats, or assisted squats with support",

//             "notes": "Avoid going below a 90-degree knee bend if it causes pain"
//           },
//           {
//             "name": "Calf Raises",
//             "description": "Stand with feet hip-width apart, hold onto a stable surface for support. Slowly raise up onto your toes, hold for 2 seconds, then lower back down",

//             "notes": "If standing is too difficult, perform calf raises while seated on a chair"
//           },
//           {
//             "name": "Cool-down",
//             "description": "Gentle stretching for 5 minutes",

//             "notes": "Focus on stretching your legs, hips, and back"
//           }
//         ]
//       },
//       {
//         "day": 2,
//         "exercises": [
//           // ... exercises for Day 2
//         ]
//       },
//       {
//         "day": 3,
//         "exercises": [
//           // ... exercises for Day 3
//         ]
//       },
//       // ... [Day 4, Day 5, etc.]
//     ],
//     "generalNotes": [
//       "Drink plenty of water throughout the day",
//       "Listen to your body and stop if you experience pain"
//     ]
//   }
//   `;

//   try {
//     const rawResult = await model.generateContent(prompt);
//     const response = await rawResult.response;

//     const filteredResponse = response.candidates[0].content.parts[0].text;

//     // Extract the JSON content from the raw result
//     const start = filteredResponse.indexOf('{');
//     console.log('start', start);
//     const end = filteredResponse.lastIndexOf('}');
//     console.log('end', end);
//     const result = filteredResponse.slice(start, end + 1);
//     console.log('result', result);
//     // Parse the extracted JSON content
//     const parsedContent = JSON.parse(result);

//     //store the response in db

//     const res = new PatientActivityPlan({
//       patientId: _id.toHexString(),
//       activityPlan: parsedContent,
//     });

//     await res.save();
//     console.log('Response saved in db:', res);
//     return res;

//     // if (
//     //   !response.candidates ||
//     //   !response.candidates[0] ||
//     //   !response.candidates[0].content
//     // ) {
//     //   throw new Error('No content received from Gemini.');
//     // }

//     // let jsonString;
//     // const content = response.candidates[0].content;

//     // if (content.parts && content.parts[0] && content.parts[0].text) {
//     //   jsonString = content.parts[0].text;
//     // } else {
//     //   jsonString = content.text || '';
//     // }

//     // const startIndex = jsonString.indexOf('{');
//     // const endIndex = jsonString.lastIndexOf('}');
//     // if (startIndex === -1 || endIndex === -1) {
//     //   throw new Error('Invalid JSON format received.');
//     // }

//     //jsonString = jsonString.substring(startIndex, endIndex + 1);

//     // Clean up the JSON string
//     // jsonString = jsonString
//     //   .replace(/"reps": "(\d+)-(\d+)"/g, '"reps": ["$1", "$2"]') // Fix reps ranges
//     //   .replace(/"duration": "(\d+) (\w+)"/g, '"duration": "$1"') // Fix duration
//     //   .replace(/"rest": "None"/g, '"rest": "0"'); // Fix rest

//     // if (!isJsonValid(jsonString)) {
//     //   throw new Error('Invalid JSON provided by Gemini.');
//     // }

//     // const activityPlan = JSON.parse(jsonString);
//     // return activityPlan;
//   } catch (error) {
//     console.error('Error generating activity plan:', error.message);
//     return 'Error generating activity plan.';
//   }
// };

// module.exports = getActivityPlanGemini;

// const express = require('express');
// const router = express.Router();
// const { GoogleGenerativeAI } = require('@google/generative-ai');
// const isJsonValid = require('is-valid-json');
// const PatientActivityPlan = require('../../models/PatientActivityPlan.model');
// const Exercise = require('../../models/workouts.model');

// // Access your API key as an environment variable (see "Set up your API key" above)
// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
// const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// const getActivityPlanGemini = async (userInput) => {
//   const {
//     _id,
//     firstName,
//     lastName,
//     dateOfBirth,
//     sex,
//     weight,
//     height,
//     pastSurgeries,
//     reasonOfHospitalization,
//     medicalNotes,
//     activityLevel,
//   } = userInput;
//   console.log('userInput', _id.toHexString());

//   // Filter exercises based on patient situation
//   const filteredExercises = await Exercise.find({
//     // Customize filtering logic based on patient data
//     // Example: Filter for exercises suitable for post-surgery recovery
//     // level: { $in: ['Beginner', 'Intermediate'] }, // Filter by difficulty level
//     // categoryMuscle: 'lower body', // Filter for lower body exercises
//     // type: { $in: ['normal', 'strength', 'warmup', 'cooldown'] }, // Filter by exercise type
//   }).select('name _id'); // Only select name and _id for the prompt

//   // Calculate age (rough estimate)
//   const birthYear = new Date(dateOfBirth).getFullYear();
//   const currentYear = new Date().getFullYear();
//   const age = currentYear - birthYear;

//   // Construct the prompt
//   const prompt = `
//   **Patient Information:**
//   * **Name:** ${firstName} ${lastName}
//   * **Age:** ${age}
//   * **Sex:** ${sex}
//   * **Weight:** ${weight} kg
//   * **Height:** ${height} cm
//   * **Activity Level:** ${activityLevel}
//   * **Past Surgeries:** ${pastSurgeries}
//   * **Reason for Hospitalization:** ${reasonOfHospitalization}
//   * **Medical Notes:** ${medicalNotes}

//   **Available Exercises:**
//   ${filteredExercises
//     .map((exercise) => `- ${exercise.name} (ID: ${exercise._id.toHexString()})`)
//     .join('\n')}

//   **Generate Activity Plan:**
//   Create a personalized activity plan for this patient. Consider their age, sex, weight, height, past surgeries, reason for hospitalization, activity level, and any limitations mentioned in the medical notes. Choose exercises from the available list above, referencing them by name or ID.

//   **Output Format:**
//   Please structure the output as a JSON object with the following format.

//   {
//     "activityPlan": [
//       {
//         "day": 1,
//         "exercises": [
//           {
//             "name": "Exercise Name", // Use the name from the available list
//             "_id": "Exercise ID" // Use the corresponding _id from the available list
//           },
//           // ... more exercises
//         ]
//       },
//       // ... [Day 2, Day 3, etc.]
//     ],
//     "generalNotes": [
//       "Important considerations for the patient, e.g., stretching, hydration, pain management"
//     ]
//   }
//   `;

//   try {
//     const rawResult = await model.generateContent(prompt);
//     const response = await rawResult.response;

//     const filteredResponse = response.candidates[0].content.parts[0].text;

//     // Extract the JSON content from the raw result
//     const start = filteredResponse.indexOf('{');
//     const end = filteredResponse.lastIndexOf('}');
//     const result = filteredResponse.slice(start, end + 1);

//     // Parse the extracted JSON content
//     const parsedContent = JSON.parse(result);

//     //store the response in db

//     const res = new PatientActivityPlan({
//       patientId: _id.toHexString(),
//       activityPlan: parsedContent,
//     });

//     await res.save();
//     console.log('Response saved in db:', res);
//     return res;
//   } catch (error) {
//     console.error('Error generating activity plan:', error.message);
//     return 'Error generating activity plan.';
//   }
// };

// module.exports = getActivityPlanGemini;

const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const isJsonValid = require('is-valid-json');
const PatientActivityPlan = require('../../models/PatientActivityPlan.model');
const Exercise = require('../../models/workouts.model');

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const getActivityPlanGemini = async (userInput) => {
  const {
    _id,
    firstName,
    lastName,
    dateOfBirth,
    sex,
    weight,
    height,
    pastSurgeries,
    reasonOfHospitalization,
    medicalNotes,
    activityLevel,
  } = userInput;
  console.log('userInput', _id.toHexString());

  // Filter exercises based on patient situation
  const filteredExercises = await Exercise.find({
    // Filter for exercises suitable for post-surgery recovery
    level: { $in: ['Beginner'] }, // Filter by difficulty level
    loc: 'Home', // Only home exercises
    equipment: 'None', // No equipment required
    type: { $in: ['normal', 'warmup', 'cooldown', 'stretching'] }, //  Filter for specific exercise types
  }).select('name _id'); // Only select name and _id for the prompt

  // Calculate age (rough estimate)
  const birthYear = new Date(dateOfBirth).getFullYear();
  const currentYear = new Date().getFullYear();
  const age = currentYear - birthYear;

  // Construct the prompt
  const prompt = `
  **Patient Information:**
  * **Name:** ${firstName} ${lastName}
  * **Age:** ${age}
  * **Sex:** ${sex}
  * **Weight:** ${weight} kg
  * **Height:** ${height} cm
  * **Activity Level:** ${activityLevel}
  * **Past Surgeries:** ${pastSurgeries}
  * **Reason for Hospitalization:** ${reasonOfHospitalization}
  * **Medical Notes:** ${medicalNotes}

  **Available Exercises:**
  ${filteredExercises
    .map((exercise) => `- ${exercise.name} (ID: ${exercise._id.toHexString()})`)
    .join('\n')}

  **Generate Activity Plan:**
  You are a Rehabilitation Specialist and should Create a personalized activity plan for this patient, focusing on light exercises that can be performed at home with no equipment. Consider their age, sex, weight, height, past surgeries, reason for hospitalization, activity level, and any limitations mentioned in the medical notes. Choose exercises from the available list above, referencing them by name or ID. Begin with a single exercise per day, and gradually increase the number of exercises as tolerated.

  **Output Format:**
  Please structure the output as a JSON object with the following format.

  {
    "activityPlan": [
      {
        "day": 1,
        "exercises": [
          {
            "name": "Exercise Name", // Use the name from the available list
            "_id": "Exercise ID" // Use the corresponding _id from the available list
          },
          // ... more exercises
        ]
      },
      // ... [Day 2, Day 3, etc.]
    ],
    "generalNotes": [
      "Important considerations for the patient, e.g., stretching, hydration, pain management"
    ]
  }
  `;

  try {
    const rawResult = await model.generateContent(prompt);
    const response = await rawResult.response;

    const filteredResponse = response.candidates[0].content.parts[0].text;

    // Extract the JSON content from the raw result
    const start = filteredResponse.indexOf('{');
    const end = filteredResponse.lastIndexOf('}');
    const result = filteredResponse.slice(start, end + 1);

    // Parse the extracted JSON content
    const parsedContent = JSON.parse(result);

    //store the response in db

    const res = new PatientActivityPlan({
      patientId: _id.toHexString(),
      activityPlan: parsedContent,
    });

    await res.save();
    console.log('Response saved in db:', res);
    // update res activityPlan by finding exercise name and adding exerciseImage
    for (const day of res.activityPlan.activityPlan) {
      for (const exercise of day.exercises) {
        const exerciseData = await Exercise.findOne({ _id: exercise._id });
        if (exerciseData) {
          exercise.name = exerciseData.name;
          exercise.exerciseImage = exerciseData.gifUrl;
        }
      }
    }
    await res.save();
    return res;
  } catch (error) {
    console.error('Error generating activity plan:', error.message);
    return 'Error generating activity plan.';
  }
};

module.exports = getActivityPlanGemini;
