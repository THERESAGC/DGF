const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Route to fetch projects by service division
router.get('/by-service-division', projectController.getProjectsByServiceDivision);

module.exports = router;