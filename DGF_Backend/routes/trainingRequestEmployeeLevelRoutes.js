// routes/trainingRequestEmployeeLevelRoutes.js
const express = require('express');
const router = express.Router();
const trainingRequestEmployeeLevelController = require('../controllers/trainingRequestEmployeeLevelController');

// Route to store employee levels for a training request
router.post('/employee-levels', trainingRequestEmployeeLevelController.storeEmployeeLevels);

module.exports = router;
