const express = require('express');
const { getEmployeesByPartialEmailController } = require('../controllers/emailSearchWithoutManagerIdController');

const router = express.Router();

router.get('/getEmployeesByEmail', getEmployeesByPartialEmailController);

module.exports = router;