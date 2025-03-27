const { getEmailReminders } = require('../services/emailReminderService');

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

module.exports = {
    fetchEmailReminders
};