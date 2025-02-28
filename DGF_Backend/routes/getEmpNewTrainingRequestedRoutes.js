const express = require('express');
const { getEmpNewTrainingRequested } = require('../controllers/getEmpNewTrainingRequestedController');

const router = express.Router();

router.get('/getEmpNewTrainingRequested', getEmpNewTrainingRequested);

module.exports = router;