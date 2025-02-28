const express = require('express');
const { deleteEmployee } = require('../controllers/empDeleteTrainingRequestedController');

const router = express.Router();

router.delete('/deleteEmployeeFromTrainingRequest', deleteEmployee);

module.exports = router;