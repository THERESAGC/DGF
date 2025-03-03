// routes/assignedCoursesRoutes.js
const express = require('express');
const router = express.Router();
const { getAssignedCourses } = require('../controllers/getassignedCoursesController');

// Define the route with emp_id and request_id as parameters
router.get('/:emp_id/:request_id', getAssignedCourses);

module.exports = router;