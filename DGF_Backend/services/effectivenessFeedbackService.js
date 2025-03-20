// // services/effectivenessFeedbackService.js
// const pool = require("../config/db"); // Import DB configuration
// const { sendEmail } = require("./mailService"); // Import email sending function

// // Query to fetch employee's email by employee_id
// const getEmployeeEmail = (employee_id) => {
//   return new Promise((resolve, reject) => {
//     const query = "SELECT emp_email FROM employee WHERE emp_id = ?";
//     pool.query(query, [employee_id], (error, results) => {
//       if (error) {
//         return reject(error);
//       }
//       if (results.length > 0) {
//         resolve(results[0].emp_email);
//       } else {
//         reject("Employee not found");
//       }
//     });
//   });
// };

// // Query to fetch manager's email based on employee's manager_id
// const getManagerEmail = (employee_id) => {
//   return new Promise((resolve, reject) => {
//     const query = `
//       SELECT emp_email 
//       FROM employee 
//       WHERE emp_id = (SELECT manager_id FROM employee WHERE emp_id = ?)
//     `;
//     pool.query(query, [employee_id], (error, results) => {
//       if (error) {
//         return reject(error);
//       }
//       if (results.length > 0) {
//         resolve(results[0].emp_email);
//       } else {
//         reject("Manager not found");
//       }
//     });
//   });
// };

// // Send feedback email to employee
// const sendFeedbackToEmployee = async (employee_id, course_name) => {
//   try {
//     const employeeEmail = await getEmployeeEmail(employee_id);
//     const subject = "Training Feedback Request";
//     const text = `<p>Please provide your feedback regarding the ${course_name} training.</p>`;
//     await sendEmail(employeeEmail, subject, text);
//     console.log("Feedback email sent to employee");
//   } catch (error) {
//     console.error("Error sending feedback email to employee:", error);
//   }
// };

// // Send reminder email to manager
// const sendReminderToManager = async (manager_email, days_since_completion) => {
//   let subject, text;
//   if (days_since_completion >= 60 && days_since_completion < 180) {
//     subject = "Reminder: Employee Feedback Needed";
//     text = "<p>Please follow up with the employee for their feedback on the training.</p>";
//   } else if (days_since_completion >= 180) {
//     subject = "Final Reminder: Employee Feedback Required";
//     text = "<p>This is a final reminder to collect feedback from the employee.</p>";
//   } else {
//     return; // Don't send reminder if not the right time
//   }

//   try {
//     await sendEmail(manager_email, subject, text);
//     console.log("Reminder email sent to manager");
//   } catch (error) {
//     console.error("Error sending reminder email to manager:", error);
//   }
// };

// // Main function to handle sending emails for a completed task
// const handleTaskCompletion = async (assignment_id) => {
//   try {
//     const query = "SELECT * FROM assigned_courses WHERE assignment_id = ?";
//     pool.query(query, [assignment_id], async (error, results) => {
//       if (error) {
//         console.error("Error fetching task details:", error);
//         return;
//       }

//       const task = results[0];
//       const employee_id = task.employee_id;
//       const mentor_id = task.mentor_id;
//       const completion_date = task.completion_date;
//       const course_name = "Upskill"; // Example, replace with dynamic course name if available
//       const currentDate = new Date();
//       const daysSinceCompletion = Math.floor((currentDate - new Date(completion_date)) / (1000 * 3600 * 24));

//       // Send feedback to the employee
//       await sendFeedbackToEmployee(employee_id, course_name);

//       // Send reminder to the manager based on the days since completion
//       await getManagerEmail(employee_id).then(async (manager_email) => {
//         await sendReminderToManager(manager_email, daysSinceCompletion);
//       }).catch(err => {
//         console.error("Error fetching manager email:", err);
//       });

//     });
//   } catch (error) {
//     console.error("Error handling task completion:", error);
//   }
// };

// module.exports = { handleTaskCompletion };
const pool = require("../config/db"); // Import DB configuration
const { sendEmail } = require("./mailService"); // Import email sending function
const mysql = require('mysql2'); // Import mysql2 for query formatting

// Query to fetch employee's email by employee_id
const getEmployeeEmail = (employee_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT emp_email FROM employee WHERE emp_id = ?";
    pool.query(query, [employee_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].emp_email);
      } else {
        reject("Employee not found");
      }
    });
  });
};

// Query to fetch manager's email based on employee's manager_id
const getManagerEmail = (employee_id) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT emp_email 
      FROM employee 
      WHERE emp_id = (SELECT manager_id FROM employee WHERE emp_id = ?)
    `;
    pool.query(query, [employee_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].emp_email);
      } else {
        reject("Manager not found");
      }
    });
  });
};

// Query to fetch course name by course_id
const getCourseName = (course_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT course_name FROM courses WHERE course_id = ?";
    pool.query(query, [course_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].course_name);
      } else {
        reject("Course not found");
      }
    });
  });
};

// Send feedback email to employee
const sendFeedbackToEmployee = async (employee_id, course_name) => {
  try {
    const employeeEmail = await getEmployeeEmail(employee_id);
    const subject = "Training Feedback Request";
    const text = `<p>Please provide your feedback regarding the ${course_name} training.</p>`;
    await sendEmail(employeeEmail, subject, text);
    console.log("Feedback email sent to employee");
  } catch (error) {
    console.error("Error sending feedback email to employee:", error);
  }
};

// Send request for feedback to manager
const sendFeedbackRequestToManager = async (manager_email, employee_id, course_name) => {
  const subject = "Request for Employee Feedback";
  const text = `
    <p>Dear Manager,</p>
    <p>We kindly request you to provide feedback for the employee who completed the ${course_name} training. 
    Please share your valuable feedback regarding the employee's performance in the training.</p>
    <p>Employee ID: ${employee_id}</p>
  `;
  try {
    await sendEmail(manager_email, subject, text);
    console.log("Request for feedback email sent to manager");
  } catch (error) {
    console.error("Error sending feedback request to manager:", error);
  }
};

// Main function to handle sending emails for a completed task
const handleTaskCompletion = async (assignment_id) => {
  try {
    const query = "SELECT * FROM assigned_courses WHERE assignment_id = ?";
    
    console.log("assignment_id:", assignment_id); // Debugging log to verify assignment_id
    console.log("Query:", mysql.format(query, [assignment_id])); // Log the formatted query
    
    pool.query(query, [assignment_id], async (error, results) => {
      if (error) {
        console.error("Error fetching task details:", error); // More descriptive error logging
        return;
      }

      if (results.length === 0) {
        console.log("No task found for assignment_id:", assignment_id); // Inform if no results found
        return;
      }

      const task = results[0];
      const employee_id = task.employee_id;
      const course_id = task.course_id;
      const completion_date = task.completion_date;
      const currentDate = new Date();
      const daysSinceCompletion = Math.floor((currentDate - new Date(completion_date)) / (1000 * 3600 * 24));

      // Fetch course name dynamically
      const course_name = await getCourseName(course_id).catch((err) => {
        console.error("Error fetching course name:", err);
        return "Unknown Course"; // Fallback if no course is found
      });

      // Send feedback to the employee (after task completion)
      await sendFeedbackToEmployee(employee_id, course_name);

      // Send feedback request to the manager based on the days since completion
      await getManagerEmail(employee_id).then(async (manager_email) => {
        // Send feedback request to the manager after 60 or 180 days
        if (daysSinceCompletion >= 60 && daysSinceCompletion < 180) {
          await sendFeedbackRequestToManager(manager_email, employee_id, course_name);
        } else if (daysSinceCompletion >= 180) {
          await sendFeedbackRequestToManager(manager_email, employee_id, course_name);
        }
      }).catch(err => {
        console.error("Error fetching manager email:", err);
      });
    });
  } catch (error) {
    console.error("Error handling task completion:", error);
  }
};

// Function to check for completed tasks and send emails to employees and managers
const checkCompletedTasksAndSendEmails = async () => {
  try {
    const query = "SELECT * FROM assigned_courses WHERE status = 'Completed'";

    console.log("Query:", query); // Debugging log for checking the query
    pool.query(query, async (error, results) => {
      if (error) {
        console.error("Error fetching completed tasks:", error);
        return;
      }

      // Loop through each completed task and handle it
      for (let task of results) {
        await handleTaskCompletion(task.assignment_id);
      }
    });
  } catch (error) {
    console.error("Error in checking completed tasks:", error);
  }
};

module.exports = { handleTaskCompletion, checkCompletedTasksAndSendEmails };
