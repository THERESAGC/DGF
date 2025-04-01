const { getEmailReminders, sendReminderEmailAndUpdate } = require('../services/emailReminderService');

const fetchEmailReminders = async (req, res) => {
  const { emp_id, role_id } = req.query; // Extract emp_id and role_id from query parameters

  console.log('Received query parameters:', { emp_id, role_id }); // Log the query parameters

  try {
    // Validate emp_id and role_id
    if (!emp_id || !role_id) {
      return res.status(400).json({ error: 'emp_id and role_id are required' });
    }

    // Fetch reminders from the service
    const reminders = await getEmailReminders(emp_id, parseInt(role_id));

    res.status(200).json(reminders);
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