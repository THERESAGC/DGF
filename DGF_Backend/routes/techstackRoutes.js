// routes/techstackRoutes.js
const express = require('express');
const router = express.Router();
const techstackController = require('../controllers/techstackController');

// Route to fetch all tech stacks
router.get('/all', techstackController.getAllTechStacks);

module.exports = router;