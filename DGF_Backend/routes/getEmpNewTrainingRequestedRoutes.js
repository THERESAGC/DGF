const express = require('express');
const router = express.Router();
const { getEmpNewTrainingRequested } = require('../controllers/getEmpNewTrainingRequestedController');

router.get('/getEmpNewTrainingRequested/:requestid', getEmpNewTrainingRequested);

module.exports = router;