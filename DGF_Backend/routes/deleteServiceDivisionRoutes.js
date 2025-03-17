const express = require('express');
const router = express.Router();
const deleteServiceDivisionController = require('../controllers/deleteServiceDivisionController');

router.delete('/delete-service-division/:id', deleteServiceDivisionController.deleteServiceDivision);

module.exports = router;