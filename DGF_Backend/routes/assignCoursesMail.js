const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/mailService');
const pool = require('../config/db');  // MySQL connection pool

// POST endpoint to send email after course is assigned
router.post('/send-email', async (req, res) => {
  const { employee_id, course_name, employee_name, completion_date, comments } = req.body;
  const emp_id = req.body.employee_id; // Assuming employee_id is passed in the request body

  try {
    // Query to fetch employee email using emp_id
    const query = 'SELECT emp_email FROM employee WHERE emp_id = ?';

    pool.query(query, [emp_id], async (error, results) => {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Get the employee's email
      const employeeEmail = results[0].emp_email;

      // If email is found, proceed to send the email
      const subject = `Course Assigned: ${course_name}`;
      const text = `Hello ${employee_name},\n\nYou have been assigned the course ${course_name} by your mentor. Please make sure to complete it by ${completion_date}.`;
      const html = `
        <html>
          <body>
            <h2>Hello ${employee_name},</h2>
            <p>You have been assigned the course <strong>${course_name}</strong> by your mentor.</p>
            <p>Completion Date: <strong>${completion_date}</strong></p>
            <p><em>Comments: ${comments}</em></p>
            <p>Please make sure to complete the course by the specified date.</p>
          </body>
        </html>
      `;

      const headerImagePath = 'assets/MailHeader.png'; // Optional
      const footerImagePath = 'assets/MailFooter.png'; // Optional

      try {
        // Send email using the retrieved employee email
        const emailResponse = await sendEmail(
          employeeEmail,  // The recipient email (fetched from database)
          subject,         // The subject of the email
          text,            // Plain text content of the email
          html,            // HTML content of the email
          headerImagePath, // Path to the header image (optional)
          footerImagePath  // Path to the footer image (optional)
        );

        res.status(200).json({ message: 'Email sent successfully', info: emailResponse });
      } catch (sendError) {
        console.error('Error sending email:', sendError);
        res.status(500).json({ message: 'Failed to send email', error: sendError.message });
      }
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Unexpected error occurred', error: error.message });
  }
});

module.exports = router;
