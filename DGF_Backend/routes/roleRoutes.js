//routes/roleRoutes.js
const express = require('express');
const router = express.Router();
const roleController = require('../controllers/roleController');

// Route to fetch sources by role ID
router.get('/sources', roleController.getSourcesByRole);

module.exports = router;
