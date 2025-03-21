const express = require('express');
const { addLearningObjectiveController } = require('../controllers/addLearningObjectiveController');

const router = express.Router();

// Route to add a new learning objective
router.post('/add-learning-objective', addLearningObjectiveController);

module.exports = router;