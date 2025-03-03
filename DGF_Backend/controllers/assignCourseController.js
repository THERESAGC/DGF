//controller/assignCourseController.js

const { assignCourse } = require('../services/assignCourseService');

const createAssignment = async (req, res) => {
  const {
    requestid,
    employee_id,
    mentor_id,
    course_id,
    coursetype_id,
    completion_date,
    comments,
    learning_type
  } = req.body;

  // Validate required fields
  if (!requestid || !employee_id || !mentor_id || !course_id || !coursetype_id) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await assignCourse({
      requestid,
      employee_id,
      mentor_id,
      course_id,
      coursetype_id,
      completion_date,
      comments,
      learning_type
    });

    res.status(201).json({
      message: 'Course assigned and statuses updated successfully',
      assignmentId: result.insertResult.insertId,
      coursesAssigned: result.incrementResult.affectedRows, // New field
      employeeStatusUpdate: result.updateEmpResult,
      requestStatusUpdate: result.updateRequestResult
    });
  } catch (error) {
    res.status(500).json({
      error: 'An error occurred while assigning the course and updating statuses',
      details: error.message
    });
  }
};

module.exports = {
  createAssignment
};