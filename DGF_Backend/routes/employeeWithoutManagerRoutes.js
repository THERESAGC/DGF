const express = require('express');
const { getEmployeesByNameWithoutManager } = require('../controllers/employeeWithoutManagerController');

const router = express.Router();

router.get('/searchWithoutManager', getEmployeesByNameWithoutManager);

module.exports = router;