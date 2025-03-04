//controller/courseStatusController.js

const { updateCourseStatus } = require('../services/courseStatusService');

const handleStatusUpdate = async (req, res) => {
  const { assignmentId } = req.params;
  const { status } = req.body;

  if (!assignmentId || !status) {
    return res.status(400).json({ 
      error: 'Missing required parameters: assignmentId and status' 
    });
  }

  try {
    const result = await updateCourseStatus(assignmentId, status);
    res.json(result);
  } catch (error) {
    console.error('Status update error:', error);
    const statusCode = error.message.includes('Invalid status') ? 400 : 500;
    res.status(statusCode).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { handleStatusUpdate };