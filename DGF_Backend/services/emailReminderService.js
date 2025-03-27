const db = require('../config/db');
const { sendEmail } = require('../services/mailService');

// Function to fetch email reminders with related information
const getEmailReminders = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                er.emailreminder_id,
                er.assignment_id,
                er.reminder_count,
                er.last_reminder_date AS last_notified,
                e1.emp_name AS notified_by,
                ac.requestid AS request_id,
                e2.emp_name AS employee_name,
                c.course_name
            FROM email_reminders er
            JOIN assigned_courses ac ON er.assignment_id = ac.assignment_id
            LEFT JOIN employee e1 ON er.email_sent_by = e1.emp_id
            LEFT JOIN employee e2 ON ac.employee_id = e2.emp_id
            LEFT JOIN course c ON ac.course_id = c.course_id
            ORDER BY er.last_reminder_date DESC
        `;

        db.execute(query, (err, results) => {
            if (err) {
                console.error('Error fetching email reminders:', err);
                reject(new Error('Failed to fetch reminders'));
            } else {
                resolve(results);
            }
        });
    });
};

const sendReminderEmailAndUpdate = async (learningInitiatedAssignments, empId) => {
    const connection = await db.promise().getConnection();
    await connection.beginTransaction();
  
    try {
      for (const assignmentId of learningInitiatedAssignments) {
        // Fetch employee email based on assignment_id
        const [employeeRows] = await connection.execute(
          `SELECT e.emp_email FROM assigned_courses ac
           JOIN employee e ON e.emp_id = ac.employee_id
           WHERE ac.assignment_id = ?`,
          [assignmentId]
        );
  
        if (employeeRows.length === 0) {
          throw new Error(`Employee not found for assignment_id: ${assignmentId}`);
        }
  
        const empEmail = employeeRows[0].emp_email;
  
        // Prepare the email content
        const subject = "Reminder: Learning Initiated Assignment";
        const text = `<p>Dear Employee,</p><p>This is a reminder that your learning assignment is initiated. Please take action.</p><p>Best regards,</p><p>Your Company</p>`;
  
        // Send the email
        await sendEmail(empEmail, subject, text, "assets/MailHeader.png", "assets/MailFooter.png");
  
        // Check if email reminder record already exists in email_reminders
        const [reminderRows] = await connection.execute(
          `SELECT * FROM email_reminders WHERE assignment_id = ?`,
          [assignmentId]
        );
  
        if (reminderRows.length > 0) {
          // Increment the reminder count and update last_reminder_date
          await connection.execute(
            `UPDATE email_reminders
             SET reminder_count = reminder_count + 1, last_reminder_date = NOW()
             WHERE assignment_id = ?`,
            [assignmentId]
          );
        } else {
          // Insert new record into email_reminders
          await connection.execute(
            `INSERT INTO email_reminders (assignment_id, reminder_count, email_sent_by, last_reminder_date)
             VALUES (?, 1, ?, NOW())`,
            [assignmentId, empId] // Assuming empId is the ID of the person triggering the reminder
          );
        }
      }
  
      await connection.commit();
      return { message: 'Emails sent and reminders updated successfully.' };
  
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };
  
module.exports = {
    getEmailReminders,sendReminderEmailAndUpdate,
};