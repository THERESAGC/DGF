const { getTotalFeedbacksTriggeredWithDates } = require('../services/feedbackTriggeredCountService');

// Controller to fetch total feedbacks triggered
const getTotalFeedbacksTriggeredController = async (req, res) => {
  try {
    const results = await getTotalFeedbacksTriggeredWithDates();
    res.status(200).json(results);
  } catch (error) {
    console.error('Error fetching total feedbacks triggered:', error);
    res.status(500).json({ error: 'Failed to fetch total feedbacks triggered' });
  }
};

module.exports = {
  getTotalFeedbacksTriggeredController,
};