// controllers/commentController.js
const InitiateTrainingcommentService = require('../services/initiateTrainingCommentsService')

// Controller to get comments for a specific request
const getTrainingComments = async (req, res) => {
  try {
    const {assignment_id} = req.query;

    // Ensure both requestid and emp_id are provided
    if (!assignment_id) {
      return res.status(400).json({ error: 'Missing assignment_id' });
    }
    const comments = await InitiateTrainingcommentService.getTrainingCommentsByAssignmentId(assignment_id);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch training comments' });
  }
};

// Controller to add a new comment
const addTrainingComments = async (req, res) => {
  try {
    console.log(req.body);
    const {assignment_id, comment_text, created_by,  created_date } = req.body;
    const newCommentId = await InitiateTrainingcommentService.addTrainingComments(assignment_id, comment_text, created_by,  created_date);

    res.status(201).json({ message: 'Training Comments added successfully', comment_id: newCommentId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add Training comment' });
  }
};

module.exports = {
    getTrainingComments,
    addTrainingComments,
};
