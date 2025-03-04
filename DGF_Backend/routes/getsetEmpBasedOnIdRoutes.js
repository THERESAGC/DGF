const express = require('express');
const getEmpbyIDController = require('../controllers/getsetEmpBasedOnIdController');

const router = express.Router();

// Route to get name of emp
router.get('/:empid', getEmpbyIDController.getEmpbyId);

// Route to add update assigned to
router.patch('/updateAssignedTo', getEmpbyIDController.setAssignedTo);

module.exports = router;
