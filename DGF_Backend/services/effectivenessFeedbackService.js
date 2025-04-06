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

const getManagerId = (employee_id) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT manager_id FROM employee WHERE emp_id = ?";
    pool.query(query, [employee_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].manager_id);  // Return the manager ID
      } else {
        reject("Manager ID not found");
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

// Query to fetch requested_by name using reqid
const getRequestedByUsingReqId = (reqid) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT e.emp_name 
      FROM newtrainingrequest ntr 
      JOIN employee e ON e.emp_id = ntr.requestonbehalfof 
      WHERE ntr.requestid = ?
    `;
    pool.query(query, [reqid], (error, results) => {
      if (error) {
        console.error("Error fetching requested_by using reqid:", error);
        return reject(error);
      }
      if (results.length > 0) {
        resolve(results[0].emp_name); // Resolve the requested_by name
      } else {
        reject("Requested By not found for reqid: " + reqid);
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
        resolve(results[0].emp_name); // Correctly resolve emp_name
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
    
    const subject = "Request for Learning Feedback";
const text = `
  <html>
    <body>
      <!-- Header Image -->
      <img src="cid:headerImage" alt="Header Image" style="width:100%; max-width:600px;">

      <p>Dear ${employeeName},</p>

      <p>We wanted to take a moment to thank you for participating in the recent Learning session <strong>${course_name}</strong>. Your engagement was truly appreciated, and we trust that you found the content valuable and relevant to your learning path.</p>

      <p>We value your feedback on the Learning experience. Your insights will not only help us assess the effectiveness of the session but also tailor future Learning initiatives to better meet the needs of our team.</p>

      <p>Would you be willing to take a few moments to share your thoughts? Kindly click on the link below to share your thoughts and feedback.</p>

      <p><a href="${feedbackURL}">Click Here To Submit Feedback</a></p>

      <p>Your feedback is invaluable to us. Please feel free to connect if you have any further feedback that is not captured/covered in the feedback form.</p>

      <p>Once again, thanks for being part of this Learning. And congratulations on completing this Learning successfully.</p>

      <p>Warm regards,</p>
      <p>Best Regards,</p>
      <p>CapDev Team</p>

      <!-- Footer Image -->
      <img src="cid:footerImage" alt="Footer Image" style="width:100%; max-width:600px;">
    </body>
  </html>
`;


    await sendEmail(employeeEmail, subject, text);
    console.log("Feedback email sent to employee");
  } catch (error) {
    console.error("Error sending feedback email to employee:", error);
  }
};

// const sendFeedbackRequestToManager = async (manager_email, employee_id, course_name, requested_by, course_id,assignment_id) => {
//   const subject = "Feedback Request for Completed Learning: " + course_name + " for <<Facilitator Name>>";
//   const request_id = await getRequestId(assignment_id);
//   // Dynamic email body with HTML, including header and footer images
//   const text = `
//     <html>
//       <body>
//         <!-- Header Image -->
//         <img src="cid:headerImage" alt="Header Image" style="width:100%; max-width:600px;">

//         <p>Dear Manager,</p>

//         <p>We hope this email finds you well.</p>

//         <p>We are reaching out regarding the completion of the <strong>${course_name}</strong> for your team, which was initiated by <<Requester>>/<<You>>.</p>

//         <p>As part of our ongoing commitment to improvement, we are seeking feedback on the recently completed Learning. Given that the Learning process was initiated by your predecessor, we understand that you may not have had direct involvement in the planning or execution.</p>

//         <p>Please take a moment to complete this brief survey:</p>
//         <a href="http://localhost:5173/feedback?employee_id=${employee_id}&reqid=${request_id}&course_id=${course_id}">Provide Feedback</a>

//         <p>To provide accurate insights, we kindly request your cooperation in coordinating with the direct manager/peer who was overseeing the Learning request. Their valuable perspective will contribute to a comprehensive evaluation of the Learning's impact and effectiveness.</p>

//         <p>If you have any questions or if there's anything we can assist you with in this regard, please do not hesitate to reach out. We value your input and look forward to hearing from you.</p>

//         <p>Thank you for your cooperation.</p>

//         <p>Best Regards,</p>
//         <p>CapDev</p>

//         <!-- Footer Image -->
//         <img src="cid:footerImage" alt="Footer Image" style="width:100%; max-width:600px;">
//       </body>
//     </html>
//   `;

//   // Specify paths for the header and footer images (replace with actual paths)
//   const headerImagePath = 'assets/MailHeader.png'; // Path to your header image
//   const footerImagePath = 'assets/MailFooter.png'; // Path to your footer image

//   try {
//     // Send the email with embedded images and the additional query parameters
//     await sendEmail(manager_email, subject, text, headerImagePath, footerImagePath);
//     console.log("Request for feedback email sent to manager");
//   } catch (error) {
//     console.error("Error sending feedback request to manager:", error);
//   }
// };

const sendFeedbackRequestToManager = async (manager_email, employee_id, course_name, requested_by, course_id, assignment_id) => {
  try {
    // Fetch the manager's ID
    const manager_id = await getManagerId(employee_id);  // Assuming you have a function to get manager's ID

    // Fetch the request_id based on assignment_id
    const request_id = await getRequestId(assignment_id);

    const subject = "Feedback Request for Completed Learning: " + course_name + " for <<Facilitator Name>>";
    
    // Dynamic email body with HTML, including header and footer images
    const text = `
      <html>
        <body>
          <!-- Header Image -->
          <img src="cid:headerImage" alt="Header Image" style="width:100%; max-width:600px;">

          <p>Dear Manager,</p>

          <p>We hope this email finds you well.</p>

          <p>We are reaching out regarding the completion of the <strong>${course_name}</strong> for your team, which was initiated by <<Requester>>/<<You>>.</p>

          <p>As part of our ongoing commitment to improvement, we are seeking feedback on the recently completed Learning. Given that the Learning process was initiated by your predecessor, we understand that you may not have had direct involvement in the planning or execution.</p>

          <p>Please take a moment to complete this brief survey:</p>
          <a href="http://localhost:5173/feedback?employee_id=${employee_id}&reqid=${request_id}&course_id=${course_id}&manager_id=${manager_id}">Provide Feedback</a>

          <p>To provide accurate insights, we kindly request your cooperation in coordinating with the direct manager/peer who was overseeing the Learning request. Their valuable perspective will contribute to a comprehensive evaluation of the Learning's impact and effectiveness.</p>

          <p>If you have any questions or if there's anything we can assist you with in this regard, please do not hesitate to reach out. We value your input and look forward to hearing from you.</p>

          <p>Thank you for your cooperation.</p>

          <p>Best Regards,</p>
          <p>CapDev</p>

          <!-- Footer Image -->
          <img src="cid:footerImage" alt="Footer Image" style="width:100%; max-width:600px;">
        </body>
      </html>
    `;

    // Specify paths for the header and footer images (replace with actual paths)
    const headerImagePath = 'assets/MailHeader.png'; // Path to your header image
    const footerImagePath = 'assets/MailFooter.png'; // Path to your footer image

    // Send the email with embedded images and the additional query parameters
    await sendEmail(manager_email, subject, text, headerImagePath, footerImagePath);
    console.log("Request for feedback email sent to manager");
  } catch (error) {
    console.error("Error sending feedback request to manager:", error);
  }
};

const updateEmailStatus = (assignment_id, column, dateColumn) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE assigned_courses SET ${column} = TRUE, ${dateColumn} = NOW() WHERE assignment_id = ?`;
    pool.query(query, [assignment_id], (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });
  });
};

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
      const completion_date = task.completion_date;
      const requested_by = await getRequestedBy(assignment_id); // Fetch requested by
      const currentDate = new Date();
      const daysSinceCompletion = Math.floor((currentDate - new Date(completion_date)) / (1000 * 3600 * 24));

      console.log(`Processing task for assignment_id: ${assignment_id}`);
      console.log(`Days since completion: ${daysSinceCompletion}`);
      console.log(`Employee email sent status: ${task.employee_email_sent}`);
      console.log(`Manager email sent status: ${task.manager_email_sent}`);
      console.log(`Manager second email sent status: ${task.manager_second_email_sent}`);

      // Fetch course name dynamically
      const course_name = await getCourseName(course_id).catch((err) => {
        console.error("Error fetching course name:", err);
        return "Unknown Course"; // Fallback if no course is found
      });

      // Send feedback to the employee (if not already sent)
      if (!task.employee_email_sent) {
        console.log("Sending feedback email to employee...");
        await sendFeedbackToEmployee(employee_id, course_name, requested_by, assignment_id);
        await updateEmailStatus(assignment_id, "employee_email_sent", "employee_email_sent_date");
        console.log("Employee email status updated.");
      }

      // Send the first feedback request to the manager (if not already sent)
      if (!task.manager_email_sent && daysSinceCompletion >= 60 && daysSinceCompletion < 180) {
        const manager_email = await getManagerEmail(employee_id).catch((err) => {
          console.error("Error fetching manager email:", err);
          return null;
        });

        if (manager_email) {
          console.log(`Sending first feedback request to manager: ${manager_email}`);
          await sendFeedbackRequestToManager(manager_email, employee_id, course_name, requested_by, course_id, assignment_id);
          await updateEmailStatus(assignment_id, "manager_email_sent", "manager_email_sent_date");
          console.log("Manager email status updated for 60 days.");
        }
      }

      // Send the second feedback request to the manager (if not already sent)
      if (!task.manager_second_email_sent && daysSinceCompletion >= 180) {
        const manager_email = await getManagerEmail(employee_id).catch((err) => {
          console.error("Error fetching manager email:", err);
          return null;
        });

        if (manager_email) {
          console.log(`Sending second feedback request to manager: ${manager_email}`);
          await sendFeedbackRequestToManager(manager_email, employee_id, course_name, requested_by, course_id, assignment_id);
          await updateEmailStatus(assignment_id, "manager_second_email_sent", "manager_second_email_sent_date");
          console.log("Manager second email status updated for 180 days.");
        }
      }
    });
  } catch (error) {
    console.error("Error handling task completion:", error);
  }
};

// const checkCompletedTasksAndSendEmails = async () => {
//   try {
//     const query = `
//       SELECT * 
//       FROM assigned_courses 
//       WHERE status = 'Completed' 
//       AND (employee_email_sent = FALSE OR manager_email_sent = FALSE OR manager_second_email_sent = FALSE)
//     `;

//     pool.query(query, async (error, results) => {
//       if (error) {
//         console.error("Error fetching completed tasks:", error);
//         return;
//       }

//       for (let task of results) {
//         await handleTaskCompletion(task.assignment_id);
//       }
//     });
//   } catch (error) {
//     console.error("Error in checking completed tasks:", error);
//   }
// };


//Created function change for the org level req emp does not get the feedback mail

const checkCompletedTasksAndSendEmails = async () => {
  try {
    const query = `
      SELECT ac.*, ntr.org_level 
      FROM assigned_courses ac
      JOIN newtrainingrequest ntr ON ac.requestid = ntr.requestid
      WHERE ac.status = 'Completed' 
      AND (ac.employee_email_sent = FALSE 
           OR ac.manager_email_sent = FALSE 
           OR ac.manager_second_email_sent = FALSE)
      AND ntr.org_level != 1;
    `;

    pool.query(query, async (error, results) => {
      if (error) {
        console.error("Error fetching completed tasks:", error);
        return;
      }

      // Loop over the tasks and handle task completion
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
  getRequestedByUsingReqId,};
