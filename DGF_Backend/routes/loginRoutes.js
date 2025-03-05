// loginRoutes.js
const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Define route for getting login data
router.get('/logins', loginController.getLoginDetails);

module.exports = router;
