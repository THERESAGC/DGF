const feedbackService = require('../services/feedbackService');

// Controller to handle the feedback submission
const submitFeedback = async (req, res) => {
  try {
    const feedbackData = req.body; // Extracting form data from request body

    // Call service function to save feedback
    const result = await feedbackService.saveFeedback(feedbackData);

    // Send response back to the client
    res.status(200).json({
      message: 'Feedback submitted successfully',
      data: result
    });
  } catch (error) {
    // If there is an error, respond with an error message
    console.error(error);
    res.status(500).json({
      message: 'Error submitting feedback',
      error: error.message
    });
  }
};

module.exports = {
  submitFeedback
};
