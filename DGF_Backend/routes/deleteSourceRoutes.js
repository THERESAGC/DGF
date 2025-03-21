const express = require('express');
const { deleteSourceController } = require('../controllers/deleteSourceController');

const router = express.Router();

// Route to delete a source
router.delete('/delete-source/:sourceId', deleteSourceController);

module.exports = router;