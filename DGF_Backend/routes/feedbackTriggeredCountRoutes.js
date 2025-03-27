const express = require('express');
const { getTotalFeedbacksTriggeredController } = require('../controllers/feedbackTriggeredCountController');

const router = express.Router();

// Route to get total feedbacks triggered
router.get('/total-feedbacks-triggered', getTotalFeedbacksTriggeredController);

module.exports = router;