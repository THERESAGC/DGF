// routes/projectRoutes.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

// Route to fetch all project names
router.get('/all', projectController.getAllProjects);

module.exports = router;
