const express = require('express');
const router = express.Router();
const sourceController = require('../controllers/sourceController');

// Route to get all sources
router.get('/sources', sourceController.getAllSources);

module.exports = router;