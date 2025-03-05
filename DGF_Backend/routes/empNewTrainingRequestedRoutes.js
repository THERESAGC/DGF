const express = require('express');
const { insertTrainingRequest } = require('../controllers/empNewTrainingRequestedController');
 
const router = express.Router();
 
router.post('/insertTrainingRequest', insertTrainingRequest);
 
module.exports = router;