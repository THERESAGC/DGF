const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

// Only keep the GET route to fetch employee details
router.get('/:id', profileController.getEmployeeDetails);

module.exports = router;