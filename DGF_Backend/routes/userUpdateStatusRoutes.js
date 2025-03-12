const express = require('express');
const { updateUserStatusController } = require('../controllers/userUpdateStatusController');

const router = express.Router();

// Route to update user status
router.put('/update-status', updateUserStatusController);

module.exports = router;