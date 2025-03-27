const db = require('../config/db'); // Database connection pool

// Function to fetch total feedbacks triggered grouped by email sent date
const getTotalFeedbacksTriggeredWithDates = () => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT COUNT(*) AS total_feedbacks_triggered, employee_email_sent_date
      FROM assigned_courses
      WHERE employee_email_sent = 1
      GROUP BY employee_email_sent_date
    `;

    db.execute(query, [], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};

module.exports = {
  getTotalFeedbacksTriggeredWithDates,
};