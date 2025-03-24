const db = require('../config/db'); // Database connection pool

// Function to save feedback data in the database
const saveFeedback = (feedbackData) => {
  return new Promise((resolve, reject) => {
    const {
      reqid,
      course_id,
      employee_id,
      instruction_rating,
      training_topic,
      engaged_rating,
      interactive,
      interactive_components,
      improved_comments,
      engaged_session_rating,
      other_suggestions
    } = feedbackData;

    // SQL query to insert the data into the learner_feedback table
    const sql = `
      INSERT INTO learner_feedback (
        reqid, course_id, employee_id,
        instruction_rating, training_topic, engaged_rating,
        interactive, interactive_components, improved_comments,
        engaged_session_rating, other_suggestions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Values corresponding to the placeholders in the SQL query
    const values = [
      reqid,
      course_id,
      employee_id,
      instruction_rating,
      training_topic,
      engaged_rating,
      interactive,
      interactive_components,
      improved_comments,
      engaged_session_rating,
      other_suggestions
    ];

    // Execute the SQL query
    db.execute(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports = {
  saveFeedback
};
