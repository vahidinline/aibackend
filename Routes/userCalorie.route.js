const express = require('express');

const router = express.Router();

// GET all userCalories
router.get('/', (req, res) => {});

// GET a specific userCalorie by ID
router.get('/:id', (req, res) => {
  // Your code here
});

// CREATE a new userCalorie
router.post('/', (req, res) => {
  // Your code here
});

// UPDATE a userCalorie by ID
router.put('/:id', (req, res) => {
  // Your code here
});

// DELETE a userCalorie by ID
router.delete('/:id', (req, res) => {
  // Your code here
});

module.exports = router;
