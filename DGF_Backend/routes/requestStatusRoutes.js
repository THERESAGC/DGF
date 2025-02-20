const express = require('express');
const router = express.Router();
const requestStatusController = require('../controllers/requestStatusController');

// Route to update request status
router.post('/update-status', requestStatusController.updateRequestStatus);

module.exports = router;