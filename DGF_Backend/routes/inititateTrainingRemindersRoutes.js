const express = require('express');
const router = express.Router();
const remindersController = require('../controllers/inititateTrainingRemindersController');

router.post('/reminders', remindersController.createReminder);
router.delete('/reminders/:reminder_id', remindersController.deleteReminder);
// router.put('/reminders/:reminder_id', remindersController.updateReminder);
router.get('/reminders/date', remindersController.getRemindersByDateandByAssignmentId);
router.get('/reminders/emp', remindersController.getRemindersByDateandByEmpId);

module.exports = router;