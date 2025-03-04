//getEmpLearningCompletionRoutes.js

const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/getEmpLearningCompletionController');
 
// Route to get employee completion status for a request
router.get('/:requestId', employeeController.getEmployeeCompletionStatus);
 
module.exports = router;