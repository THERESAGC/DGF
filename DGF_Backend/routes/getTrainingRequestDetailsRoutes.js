const express = require('express');
const router = express.Router();
const { getTrainingRequestDetailsById } = require('../controllers/getTrainingRequestDetailsController');

router.get('/training-request/:requestid', getTrainingRequestDetailsById);

module.exports = router;