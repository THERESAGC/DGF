// routes/employeeSearchByEmailRoutes.js
const express = require('express');
const router = express.Router();
const employeeSearchByEmailController = require('../controllers/employeeSearchByEmailController');

// Route to search employees by email
router.get('/search-by-email', employeeSearchByEmailController.searchEmployeesByEmail);

module.exports = router;
