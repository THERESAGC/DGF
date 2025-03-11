const express = require('express');
const TrainingCommentController = require('../controllers/initiateTrainingCommentsController');

const router = express.Router();

// Route to get comments for a specific request
router.get('/', TrainingCommentController.getTrainingComments);

// Route to add a new comment
router.post('/', TrainingCommentController.addTrainingComments);

module.exports = router;
