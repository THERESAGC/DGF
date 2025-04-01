const express = require('express');
const { fetchEmailReminders } = require('../controllers/emailReminderController');
const { sendReminder } = require('../controllers/emailReminderController');

const router = express.Router();

// Route to fetch all email reminder
router.get('/reminders', fetchEmailReminders);
router.post('/send-reminder', sendReminder);

module.exports = router;