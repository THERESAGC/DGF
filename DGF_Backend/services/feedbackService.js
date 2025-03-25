// const db = require('../config/db'); // Database connection pool

// // Function to save feedback data in the database
// const saveFeedback = (feedbackData) => {
//   return new Promise((resolve, reject) => {
//     const {
//       reqid,
//       course_id,
//       employee_id,
//       instruction_rating,
//       training_topic,
//       engaged_rating,
//       interactive,
//       interactive_components,
//       improved_comments,
//       engaged_session_rating,
//       other_suggestions
//     } = feedbackData;

//     // SQL query to insert the data into the learner_feedback table
//     const sql = `
//       INSERT INTO learner_feedback (
//         reqid, course_id, employee_id,
//         instruction_rating, training_topic, engaged_rating,
//         interactive, interactive_components, improved_comments,
//         engaged_session_rating, other_suggestions
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     // Values corresponding to the placeholders in the SQL query
//     const values = [
//       reqid,
//       course_id,
//       employee_id,
//       instruction_rating,
//       training_topic,
//       engaged_rating,
//       interactive,
//       interactive_components,
//       improved_comments,
//       engaged_session_rating,
//       other_suggestions
//     ];

//     // Execute the SQL query
//     db.execute(sql, values, (err, result) => {
//       if (err) {
//         reject(err);
//       } else {
//         resolve(result);
//       }
//     });
//   });
// };

// module.exports = {
//   saveFeedback
// };
const db = require('../config/db'); // Database connection pool

// Function to save feedback data in the database (existing one)
const saveExistingFeedback = (feedbackData) => {
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

    const sql = `
      INSERT INTO learner_feedback (
        reqid, course_id, employee_id,
        instruction_rating, training_topic, engaged_rating,
        interactive, interactive_components, improved_comments,
        engaged_session_rating, other_suggestions
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

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

    db.execute(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

// Function to save manager feedback (new function)
const saveManagerFeedback = (feedbackData) => {
  return new Promise((resolve, reject) => {
    const {
      reqid,
      course_id,
      employee_id,
      demonstrate_skill,        // Whether the learner has been given an opportunity to demonstrate the skill
      skill_date,               // If Yes, the date when skill was demonstrated
      enhancement_rating,       // Rating enhancement of the skill (1 to 4 scale)
      suggestions,              // Suggestions/comments for the next skill
      opportunity_date          // If No, the date when the opportunity will arise
    } = feedbackData;

    // SQL query to insert the data into the manager_feedback table
    const sql = `
      INSERT INTO manager_feedback (
        reqid, course_id, employee_id,
        demonstrate_skill, skill_date, enhancement_rating, 
        suggestions, opportunity_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    // Values corresponding to the placeholders in the SQL query
    const values = [
      reqid,
      course_id,
      employee_id,
      demonstrate_skill,
      skill_date,               // Set skill date only if 'Yes'
      enhancement_rating,       // Set enhancement rating if 'Yes'
      suggestions,
      opportunity_date          // Set opportunity date only if 'No'
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
  saveExistingFeedback,
  saveManagerFeedback
};
