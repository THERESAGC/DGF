const express = require('express');
const { addServiceDivisionController } = require('../controllers/addServiceDivisionController');

const router = express.Router();

router.post('/add-service-division', addServiceDivisionController);

module.exports = router;