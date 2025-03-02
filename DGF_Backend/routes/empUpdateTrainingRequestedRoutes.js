const express = require('express');
const { updateMultipleTrainingRequests } = require('../controllers/empUpdateTrainingRequestedController');

const router = express.Router();

router.put('/updateMultipleTrainingRequests', updateMultipleTrainingRequests);

module.exports = router;