// const express = require('express');
// const router = express.Router();
// const feedbackController = require('../controllers/feedbackController');

// // Define POST route to submit feedback
// router.post('/feedback', feedbackController.submitFeedback);

// module.exports = router;
const express = require('express');
const router = express.Router();
const feedbackController = require('../controllers/feedbackController');

// Define POST route to submit general feedback (existing one)
router.post('/feedback', feedbackController.submitFeedback);

// Define POST route to submit manager feedback (new one)
router.post('/manager-feedback', feedbackController.submitManagerFeedback);

module.exports = router;
