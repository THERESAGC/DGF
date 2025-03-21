// controllers/effectivenessFeedbackController.js
const { handleTaskCompletion } = require("../services/effectivenessFeedbackService");

const handleTaskCompletionRequest = async (req, res) => {
  const { assignment_id } = req.params; // Assuming the assignment_id is passed as a URL parameter
  try {
    await handleTaskCompletion(assignment_id);
    res.status(200).send({ message: "Emails sent successfully" });
  } catch (error) {
    res.status(500).send({ message: "Error handling task completion", error });
  }
};

module.exports = { handleTaskCompletionRequest };
