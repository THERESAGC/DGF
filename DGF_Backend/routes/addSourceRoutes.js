const express = require('express');
const { addSourceController } = require('../controllers/addSourceController');

const router = express.Router();

// Route to add a new source
router.post('/add-source', addSourceController);

module.exports = router;