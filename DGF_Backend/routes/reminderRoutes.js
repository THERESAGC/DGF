
// routes/reminderRoutes.js

const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/mailService'); // Import email service
const pool = require('../config/db'); // MySQL connection pool

// Endpoint to send email reminders for learning initiated assignments
router.post('/send-email-reminders', async (req, res) => {
  const { empIds, requestId, empIdFromFrontend } = req.body; // Extract necessary data from the frontend request

  try {
    // Process each employee ID
    for (const empId of empIds) {
      // Step 1: Fetch assigned courses for the employee from the database
      const query = `SELECT * FROM assigned_courses WHERE employee_id = ? AND request_id = ?`;
      const [assignedCourses] = await pool.promise().query(query, [empId, requestId]);

      // Step 2: Filter assignments that are "Learning Initiated"
      const learningInitiatedAssignments = assignedCourses.filter(course => course.status === 'Learning Initiated');

      // Step 3: Process each assignment
      for (const assignment of learningInitiatedAssignments) {
        const assignmentId = assignment.assignment_id;

        // Step 4: Fetch employee's email address
        const employeeQuery = `SELECT emp_email FROM employees WHERE emp_id = ?`;
        const [employeeData] = await pool.promise().query(employeeQuery, [empId]);

        if (employeeData.length === 0) {
          console.log(`No employee found with empId: ${empId}`);
          continue;
        }

        const empEmail = employeeData[0].emp_email;

        // Step 5: Send email reminder
        const subject = "Learning Initiated Reminder";
        const text = `Dear Employee, you have assignments marked as "Learning Initiated". Please proceed with them.`;

        // Call your email service to send the email
        await sendEmail(empEmail, subject, text, 'assets/MailHeader.png', 'assets/MailFooter.png');

        // Step 6: Update email_reminders table
        const reminderQuery = `SELECT * FROM email_reminders WHERE assignment_id = ? AND employee_id = ?`;
        const [reminderData] = await pool.promise().query(reminderQuery, [assignmentId, empId]);

        if (reminderData.length > 0) {
          // Update reminder count and last reminder date
          const reminderUpdateQuery = `
            UPDATE email_reminders 
            SET reminder_count = reminder_count + 1, 
                last_reminder_date = NOW(), 
                email_sent_by = ? 
            WHERE assignment_id = ? AND employee_id = ?`;
          await pool.promise().query(reminderUpdateQuery, [empIdFromFrontend, assignmentId, empId]);
        } else {
          // Insert new reminder record
          const reminderInsertQuery = `
            INSERT INTO email_reminders (assignment_id, employee_id, reminder_count, email_sent_by, last_reminder_date)
            VALUES (?, ?, 1, ?, NOW())`;
          await pool.promise().query(reminderInsertQuery, [assignmentId, empId, empIdFromFrontend]);
        }
      }
    }

    // Return a success response
    res.status(200).json({ message: 'Email reminders sent successfully' });
  } catch (error) {
    console.error('Error in sending email reminders:', error);
    res.status(500).json({ message: 'Failed to send email reminders' });
  }
});

module.exports = router;
