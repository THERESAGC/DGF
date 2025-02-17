const express = require('express');
const router = express.Router();
const getMaxRequestIdController = require('../controllers/getMaxRequestIdController');

// Define the route to get the next request ID
router.get('/max-request-id', getMaxRequestIdController.getMaxRequestId);

module.exports = router;
