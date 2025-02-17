//routes/newTrainingRequestRoutes.js

const express = require('express');
const router = express.Router();
const newTrainingRequestController = require('../controllers/newTrainingRequestController');

// Route to handle creating new training requests
router.post('/', newTrainingRequestController.createNewTrainingRequest);

module.exports = router;
