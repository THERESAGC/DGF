// routes/employeeLevelRoutes.js
const express = require('express');
const router = express.Router();
const employeeLevelController = require('../controllers/employeeLevelController');

// Route to fetch all job titles
router.get('/all', employeeLevelController.getAllJobTitles);

module.exports = router;
