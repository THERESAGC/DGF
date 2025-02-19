const express = require('express');
const router = express.Router();
const { searchEmployees } = require('../controllers/employeeSearchByNameController');

router.get('/searchEmployeesByName', searchEmployees);

module.exports = router;