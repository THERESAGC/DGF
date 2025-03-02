const express = require('express');
const { updateTrainingRequest } = require('../controllers/empUpdateTrainingRequestedController');

const router = express.Router();

router.put('/updateTrainingRequest', updateTrainingRequest);

module.exports = router;