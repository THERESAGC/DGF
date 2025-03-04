//routes/courseStatusRoutes.js

const express = require('express');
const router = express.Router();
const { handleStatusUpdate } = require('../controllers/courseStatusController');

// PUT /api/course-status/:assignmentId
router.put('/:assignmentId', 
  express.json(),
  handleStatusUpdate
);

module.exports = router;