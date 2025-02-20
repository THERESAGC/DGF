const express = require('express');
const router = express.Router();
const { searchEmployees } = require('../controllers/employeeSearchByEmailController');

router.get('/searchEmployeesByManagerIdAndEmail', searchEmployees);

module.exports = router;