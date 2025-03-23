const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Define POST route to submit feedback
router.post('/feedback', feedbackController.submitFeedback);

module.exports = router;
