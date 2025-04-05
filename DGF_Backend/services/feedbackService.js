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
// const saveManagerFeedback = (feedbackData) => {
//   return new Promise((resolve, reject) => {
//     const {
//       reqid,
//       course_id,
//       employee_id,
//       demonstrate_skill,        // Whether the learner has been given an opportunity to demonstrate the skill
//       skill_date,               // If Yes, the date when skill was demonstrated
//       enhancement_rating,       // Rating enhancement of the skill (1 to 4 scale)
//       suggestions,              // Suggestions/comments for the next skill
//       opportunity_date          // If No, the date when the opportunity will arise
//     } = feedbackData;

//     // SQL query to insert the data into the manager_feedback table
//     const sql = `
//       INSERT INTO manager_feedback (
//         reqid, course_id, employee_id,
//         demonstrate_skill, skill_date, enhancement_rating, 
//         suggestions, opportunity_date
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     // Values corresponding to the placeholders in the SQL query
//     const values = [
//       reqid,
//       course_id,
//       employee_id,
//       demonstrate_skill,
//       skill_date,               // Set skill date only if 'Yes'
//       enhancement_rating,       // Set enhancement rating if 'Yes'
//       suggestions,
//       opportunity_date          // Set opportunity date only if 'No'
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

const checkFeedbackSubmissionWindow = (reqid, course_id, employee_id) => {
  return new Promise((resolve, reject) => {
    const sql = `
      SELECT feedback_submitted_date
      FROM manager_feedback
      WHERE reqid = ? AND course_id = ? AND employee_id = ?
      ORDER BY feedback_submitted_date DESC
      LIMIT 1
    `;
    const values = [reqid, course_id, employee_id];

    db.execute(sql, values, (err, result) => {
      if (err) {
        reject(err);
      } else {
        if (result.length > 0) {
          const lastSubmissionDate = result[0].feedback_submitted_date;
          const currentDate = new Date();
          const lastSubmission = new Date(lastSubmissionDate);

          // Calculate the time difference (in months)
          const diffMonths = (currentDate.getFullYear() - lastSubmission.getFullYear()) * 12 + (currentDate.getMonth() - lastSubmission.getMonth());

          // If the difference is less than 6 months, don't allow submission
          if (diffMonths < 4) {
            resolve(false);  // User can't submit again yet
          } else {
            resolve(true);   // User can submit again
          }
        } else {
          resolve(true);  // No previous submission, allow submission
        }
      }
    });
  });
};
const saveManagerFeedback = async (feedbackData) => {
  const {
    reqid,
    course_id,
    employee_id,
    manager_id,
    demonstrate_skill,
    skill_date,
    enhancement_rating,
    suggestions,
    opportunity_date,
  } = feedbackData;

  // First, check if the user is allowed to submit feedback (6-month window check)
  const canSubmit = await checkFeedbackSubmissionWindow(reqid, course_id, employee_id);

  if (!canSubmit) {
    throw new Error("You have already submitted feedback for this course within the past 6 months.");
  }

  // Proceed with saving feedback if submission is allowed
  return new Promise((resolve, reject) => {
    const feedbackSubmittedDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    const sql = `
      INSERT INTO manager_feedback (
        reqid, course_id, employee_id, manager_id,  
        demonstrate_skill, skill_date, enhancement_rating, 
        suggestions, opportunity_date, feedback_submitted_date
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      reqid,
      course_id,
      employee_id,
      manager_id,
      demonstrate_skill,
      skill_date,
      enhancement_rating,
      suggestions,
      opportunity_date,
      feedbackSubmittedDate,
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

// const saveManagerFeedback = (feedbackData) => {
//   return new Promise((resolve, reject) => {
//     const {
//       reqid,
//       course_id,
//       employee_id,
//       manager_id,              // Add manager_id to the feedback data
//       demonstrate_skill,        // Whether the learner has been given an opportunity to demonstrate the skill
//       skill_date,               // If Yes, the date when skill was demonstrated
//       enhancement_rating,       // Rating enhancement of the skill (1 to 4 scale)
//       suggestions,              // Suggestions/comments for the next skill
//       opportunity_date          // If No, the date when the opportunity will arise
//     } = feedbackData;

//     // Get current timestamp for feedback submission date
//     const feedbackSubmittedDate = new Date().toISOString().slice(0, 19).replace('T', ' '); // Format: 'YYYY-MM-DD HH:MM:SS'

//     // SQL query to insert the data into the manager_feedback table
//     const sql = `
//       INSERT INTO manager_feedback (
//         reqid, course_id, employee_id, manager_id,  
//         demonstrate_skill, skill_date, enhancement_rating, 
//         suggestions, opportunity_date, feedback_submitted_date
//       ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//     `;

//     // Values corresponding to the placeholders in the SQL query
//     const values = [
//       reqid,
//       course_id,
//       employee_id,
//       manager_id,              // Include manager_id here
//       demonstrate_skill,
//       skill_date,               // Set skill date only if 'Yes'
//       enhancement_rating,       // Set enhancement rating if 'Yes'
//       suggestions,
//       opportunity_date,         // Set opportunity date only if 'No'
//       feedbackSubmittedDate     // Current timestamp for feedback submission
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



module.exports = {
  saveExistingFeedback,
  saveManagerFeedback
};
