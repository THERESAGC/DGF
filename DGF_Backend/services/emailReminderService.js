const db = require('../config/db');

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

module.exports = {
    getEmailReminders
};