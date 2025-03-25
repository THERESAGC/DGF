const express = require('express');
const router = express.Router();
const { showNotifications, markAsRead, createNotification,fetchAssignmentNotification } = require('../controllers/notificationController');

router.get('/', showNotifications);
router.post('/mark-as-read', markAsRead);
router.post('/createnotifications',createNotification );
router.post('/assignment', fetchAssignmentNotification);

module.exports = router;