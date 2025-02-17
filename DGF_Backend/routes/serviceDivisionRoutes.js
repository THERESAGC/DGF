const express = require('express');
const router = express.Router();
const serviceDivisionController = require('../controllers/serviceDivisionController');

// Define the route for fetching all services
router.get('/services', serviceDivisionController.getAllServices);

module.exports = router;
