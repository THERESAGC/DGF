const { updateCourseStatus } = require('../services/courseStatusService');

const handleStatusUpdate = async (req, res) => {
  const { assignmentId } = req.params;
  const { status } = req.body;

  try {
    const result = await updateCourseStatus(assignmentId, status);
    res.json(result);
  } catch (error) {
    console.error('Status update error:', error);
    res.status(500).json({ 
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

module.exports = { handleStatusUpdate };