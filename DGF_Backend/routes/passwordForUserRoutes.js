// routes/passwordForUserRoutes.js
const express = require('express');
const { requestPasswordChange, changePassword } = require('../controllers/passwordForUserController');

const router = express.Router();

router.post('/request-password-change', requestPasswordChange);
router.post('/change-password', changePassword);

module.exports = router;
