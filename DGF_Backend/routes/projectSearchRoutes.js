const express = require('express');
const router = express.Router();
const { searchProjects } = require('../controllers/projectSearchController');

// Route to search projects by name starting with a specific letter
router.get('/search', searchProjects);

module.exports = router;