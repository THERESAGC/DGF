//routes/courseStatusRoutes.js

const express = require('express');
const router = express.Router();
const { handleStatusUpdate } = require('../controllers/courseStatusController');

router.put('/:assignmentId', handleStatusUpdate);

module.exports = router;