const express = require('express');
const { getEmpsforCapdev } = require('../controllers/getEmployeesBasedOnRoleController');

const router = express.Router();

router.get('/getEmpsforCapdev', getEmpsforCapdev);

module.exports = router;