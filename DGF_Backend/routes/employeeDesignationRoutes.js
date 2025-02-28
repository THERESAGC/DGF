const express = require('express');
const { getEmployeesByDesignationController } = require('../controllers/employeeController');

const router = express.Router();

router.get('/getEmployeesByDesignation', getEmployeesByDesignationController);

module.exports = router;