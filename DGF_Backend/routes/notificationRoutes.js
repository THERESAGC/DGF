const express = require('express');
const router = express.Router();
const { showNotifications, markAsRead } = require('../controllers/notificationController');

router.get('/', showNotifications);
router.post('/mark-as-read', markAsRead);

module.exports = router;