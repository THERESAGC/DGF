const express = require('express');
const { deleteLearningObjectiveController } = require('../controllers/deleteLearningObjectiveController');

const router = express.Router();

// Route to delete a learning objective
router.delete('/delete-learning-objective/:trainingId', deleteLearningObjectiveController);

module.exports = router;