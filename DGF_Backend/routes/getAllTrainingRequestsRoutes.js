const express = require('express');
const router = express.Router();
const getAllTrainingRequestsController = require('../controllers/getAllTrainingRequestsController');

// Define the route to get all training requests
router.get('/', getAllTrainingRequestsController.getAllTrainingRequests);

module.exports = router;
