// routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeSearchByNameController');

// Route to search employees by name
router.get('/search', employeeController.searchEmployees);

module.exports = router;
