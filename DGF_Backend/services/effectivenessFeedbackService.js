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
    const query = "SELECT course_name FROM course WHERE course_id = ?";
    pool.query(query, [course_id], (error, results) => {
      if (error) {
        console.error("Database error:", error); // Debug log
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].course_name);
      } else {
        console.error("Course not found for course_id:", course_id); // Debug log
        reject("Course not found");
      }
    });
  });
};

// Query to fetch requested_by name from the assigned_courses table
const getRequestedBy = (assignment_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT e.emp_name FROM assigned_courses ac JOIN newtrainingrequest ntr ON ntr.requestid = ac.requestid JOIN employee e ON e.emp_id = ntr.requestonbehalfof WHERE ac.assignment_id = ?";
    pool.query(query, [assignment_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].requested_by); // Assuming requested_by is the name
      } else {
        reject("Requested By not found");
      }
    });
  });
};

// Function to fetch employee's name (if needed for email greeting)
const getEmployeeName = (employee_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT emp_name FROM employee WHERE emp_id = ?";
    pool.query(query, [employee_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].emp_name);
      } else {
        reject("Employee not found");
      }
    });
  });
};

// Query to fetch request_id from the newtrainingrequest table
const getRequestId = (assignment_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT ntr.requestid FROM assigned_courses ac JOIN newtrainingrequest ntr ON ntr.requestid = ac.requestid WHERE ac.assignment_id = ?";
    pool.query(query, [assignment_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].requestid); // Get the requestid
      } else {
        reject("Request ID not found");
      }
    });
  });
};

// Query to fetch course_id based on assignment_id
const getCourseId = (assignment_id) => {
  console.log("Inside getCourseId, received assignment_id:", assignment_id); // Debugging log
  return new Promise((resolve, reject) => {
    const query = "SELECT course_id FROM assigned_courses WHERE assignment_id = ?";
    pool.query(query, [assignment_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].course_id);
      } else {
        reject("Course ID not found");
      }
    });
  });
};

const sendFeedbackToEmployee = async (employee_id, course_name, requested_by, assignment_id) => {
  try {
    const employeeEmail = await getEmployeeEmail(employee_id);
    const employeeName = await getEmployeeName(employee_id);
    const request_id = await getRequestId(assignment_id); // Fetch the request_id
    const course_id = await getCourseId(assignment_id);  // Fetch the course_id, if needed
   

    // Prepare the URL with just reqid, course_id, and employee_id as query parameters
    const feedbackURL = `http://localhost:5173/userfeedback?reqid=${request_id}&course_id=${course_id}&employee_id=${employee_id}`;
    
    const subject = "Training Feedback Request";
    const text = `
      <p>Dear ${employeeName},</p>
      <p>We kindly request you to provide your feedback regarding the ${course_name} training.</p>
      <p>This feedback was requested by: ${requested_by}</p>
      <p>Please click the link below to provide your feedback:</p>
      <a href="${feedbackURL}">Provide Feedback</a>
      <p>Best regards,</p>
      <p>Training Team</p>
    `;

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
  <p>We kindly request you to provide feedback for the employee who completed the ${course_name} training. Please share your valuable feedback regarding the employee's performance in the training.</p>
  <p>Employee ID: ${employee_id}</p>
  <a href="http://localhost:5173/feedback?employee_id=${employee_id}&course_name=${course_name}">Provide Feedback</a>
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

    pool.query(query, [assignment_id], async (error, results) => {
      if (error) {
        console.error("Error fetching task details:", error);
        return;
      }

      if (results.length === 0) {
        console.log("No task found for assignment_id:", assignment_id);
        return;
      }

      const task = results[0];
      const employee_id = task.employee_id;
      const course_id = task.course_id;
      const assignment_id = task.assignment_id;
      const completion_date = task.completion_date;
      const requested_by = await getRequestedBy(assignment_id); // Fetch requested by
      const currentDate = new Date();
      const daysSinceCompletion = Math.floor((currentDate - new Date(completion_date)) / (1000 * 3600 * 24));
      
      // Fetch course name dynamically
      const course_name = await getCourseName(course_id).catch((err) => {
        console.error("Error fetching course name:", err);
        return "Unknown Course"; // Fallback if no course is found
      });
      
      // Send feedback to the employee (after task completion)
      await sendFeedbackToEmployee(employee_id, course_name, requested_by, assignment_id);

      // Send feedback request to the manager (after a certain time)
      await getManagerEmail(employee_id).then(async (manager_email) => {
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


module.exports = { handleTaskCompletion, 
  checkCompletedTasksAndSendEmails,
  getEmployeeName,
  getCourseName,
  getRequestedBy,};
