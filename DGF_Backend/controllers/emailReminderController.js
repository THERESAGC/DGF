const { getEmailReminders } = require('../services/emailReminderService');
const { sendReminderEmailAndUpdate } = require('../services/emailReminderService')

// Controller to fetch all email reminders with related information
const fetchEmailReminders = async (req, res) => {
    try {
        const reminders = await getEmailReminders();
        res.status(200).json(reminders);
        console.log("______________")
    } catch (error) {
        console.error('Error fetching email reminders:', error);
        res.status(500).json({ error: 'Failed to fetch reminders' });
    }
};
const sendReminder = async (req, res) => {
    const { learningInitiatedAssignments, empId } = req.body;
  
    try {
      const result = await sendReminderEmailAndUpdate(learningInitiatedAssignments, empId);
      res.status(200).json(result);
    } catch (error) {
      console.error("Error in sending reminder email:", error);
      res.status(500).json({ message: 'Failed to send email reminders', error: error.message });
    }
  };

module.exports = {
    fetchEmailReminders,sendReminder 
};