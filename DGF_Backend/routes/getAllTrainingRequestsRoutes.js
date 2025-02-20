const express = require('express');
const router = express.Router();
const { getAllRequests } = require('../controllers/getAllTrainingRequestsController');

router.get('/', getAllRequests);

module.exports = router;