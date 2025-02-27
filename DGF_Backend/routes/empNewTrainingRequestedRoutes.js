const express = require('express');
const { insertTrainingRequest, removeEmployeeFromTrainingRequest } = require('../controllers/empNewTrainingRequestedController');

const router = express.Router();

router.post('/insert-training-request', insertTrainingRequest);
router.delete('/remove-employee', removeEmployeeFromTrainingRequest);

module.exports = router;