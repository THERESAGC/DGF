// const express = require('express');
// const router = express.Router();
// const { sendEmail } = require('../services/mailService');
// const pool = require('../config/db');  // MySQL connection pool

// // POST endpoint to send email after course is assigned
// router.post('/send-email', async (req, res) => {
//   const { employee_id, course_name, employee_name, completion_date, comments } = req.body;
//   const emp_id = req.body.employee_id; // Assuming employee_id is passed in the request body

//   try {
//     // Query to fetch employee email using emp_id
//     const query = 'SELECT emp_email FROM employee WHERE emp_id = ?';

//     pool.query(query, [emp_id], async (error, results) => {
//       if (error) {
//         console.error('Error querying the database:', error);
//         return res.status(500).json({ message: 'Database error', error: error.message });
//       }

//       if (results.length === 0) {
//         return res.status(404).json({ message: 'Employee not found' });
//       }

//       // Get the employee's email
//       const employeeEmail = results[0].emp_email;

//       // If email is found, proceed to send the email
//       const subject = `Course Assigned: ${course_name}`;
//       // const text = `Hello ${employee_name},\n\nYou have been assigned the course ${course_name} by your mentor. Please make sure to complete it by ${completion_date}.`;
//       const html = `
//     <html>
//   <body>
//     <div>
//       <img src="cid:headerImage" alt="Header Image" style="width: 100%; height: auto;" />
//     </div>
//     <h2>Hello ${employee_name},</h2>
//     <p>We are pleased to inform you that you have been assigned the course <strong>${course_name}</strong> by your mentor. This course is an essential part of your professional development and will help enhance your skills in the respective area.</p>
//     <p><strong>Completion Date:</strong> ${completion_date}</p>
//     <p>We kindly request that you complete the course by the specified date. This will ensure that you stay on track with your growth and meet your learning goals. If you encounter any issues or need assistance while completing the course, please don't hesitate to reach out to your mentor or the CAPDEV team.</p>
//     <p>We appreciate your dedication to continuous learning and development.</p>
//     <p>Best regards,</p>
//     <p>CAPDEV Team</p>
//     <div>
//       <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
//     </div>
//   </body>
// </html>

//   `;
//       // const html = `
//       //   <html>
//       //     <body>
//       //       <h2>Hello ${employee_name},</h2>
//       //       <p>You have been assigned the course <strong>${course_name}</strong> by your mentor.</p>
//       //       <p>Completion Date: <strong>${completion_date}</strong></p>
//       //       <p><em>Comments: ${comments}</em></p>
//       //       <p>Please make sure to complete the course by the specified date.</p>
//       //     </body>
//       //   </html>
//       // `;

//       const headerImagePath = 'assets/MailHeader.png'; // Optional
//       const footerImagePath = 'assets/MailFooter.png'; // Optional

//       try {
//         // Send email using the retrieved employee email
//         const emailResponse = await sendEmail(
//           employeeEmail,  // The recipient email (fetched from database)
//           subject,         // The subject of the email
//                       // Plain text content of the email
//           html,            // HTML content of the email
//           headerImagePath, // Path to the header image (optional)
//           footerImagePath  // Path to the footer image (optional)
//         );

//         res.status(200).json({ message: 'Email sent successfully', info: emailResponse });
//       } catch (sendError) {
//         console.error('Error sending email:', sendError);
//         res.status(500).json({ message: 'Failed to send email', error: sendError.message });
//       }
//     });
//   } catch (error) {
//     console.error('Unexpected error:', error);
//     res.status(500).json({ message: 'Unexpected error occurred', error: error.message });
//   }
// });

// module.exports = router;
/*
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/mailService');
const pool = require('../config/db');  // MySQL connection pool

// POST endpoint to send email after course is assigned
router.post('/send-email', async (req, res) => {
  const { employee_id, course_name, employee_name, completion_date } = req.body;
  const emp_id = req.body.employee_id; // Assuming employee_id is passed in the request body
  console.log('Received request to send email:', req.body); // Log the request body for debugging
  try {
    // Query to fetch employee name and email using emp_id
    const query = 'SELECT emp_name, emp_email FROM employee WHERE emp_id = ?';

    pool.query(query, [emp_id], async (error, results) => {
      if (error) {
        console.error('Error querying the database:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Get the employee's name and email
      const employeeName = results[0].emp_name;
      const employeeEmail = results[0].emp_email;

      // Subject and HTML body of the email
      const subject = `Course Assigned: ${course_name}`;
      const html = `
    <html>
  <body>
    <div>
      <img src="cid:headerImage" alt="Header Image" style="width: 100%; height: auto;" />
    </div>
    <h2>Hello ${employeeName},</h2>
    <p>We are pleased to inform you that you have been assigned the course <strong>${course_name}</strong> by your mentor. This course is an essential part of your professional development and will help enhance your skills in the respective area.</p>
    <p><strong>Completion Date:</strong> ${completion_date}</p>
    <p>We kindly request that you complete the course by the specified date. This will ensure that you stay on track with your growth and meet your learning goals. If you encounter any issues or need assistance while completing the course, please don't hesitate to reach out to your mentor or the CAPDEV team.</p>
    <p>We appreciate your dedication to continuous learning and development.</p>
    <p>Best regards,</p>
    <p>CAPDEV Team</p>
    <div>
      <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
    </div>
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
*/
const express = require('express');
const router = express.Router();
const { sendEmail } = require('../services/mailService');
const pool = require('../config/db');  // MySQL connection pool

// POST endpoint to send email after course is assigned
router.post('/send-email', async (req, res) => {
  const { employee_id, course_id, completion_date } = req.body;
  console.log('Received request to send email:', req.body); // Log the request body for debugging
  try {
    // Query to fetch employee name and email using emp_id
    const employeeQuery = 'SELECT emp_name, emp_email FROM employee WHERE emp_id = ?';
    
    pool.query(employeeQuery, [employee_id], async (error, employeeResults) => {
      if (error) {
        console.error('Error querying the employee database:', error);
        return res.status(500).json({ message: 'Database error', error: error.message });
      }

      if (employeeResults.length === 0) {
        return res.status(404).json({ message: 'Employee not found' });
      }

      // Get the employee's name and email
      const employeeName = employeeResults[0].emp_name;
      const employeeEmail = employeeResults[0].emp_email;

      // Query to fetch course name using course_id
      const courseQuery = 'SELECT course_name FROM course WHERE course_id = ?';

      pool.query(courseQuery, [course_id], async (error, courseResults) => {
        if (error) {
          console.error('Error querying the course database:', error);
          return res.status(500).json({ message: 'Database error', error: error.message });
        }

        if (courseResults.length === 0) {
          return res.status(404).json({ message: 'Course not found' });
        }

        // Get the course name
        const courseName = courseResults[0].course_name;

        // Subject and HTML body of the email
        const subject = `Course Assigned: ${courseName}`;
        const html = `
          <html>
            <body>
              <div>
                <img src="cid:headerImage" alt="Header Image" style="width: 100%; height: auto;" />
              </div>
              <h2>Hello ${employeeName},</h2>
              <p>We are pleased to inform you that you have been assigned the course <strong>${courseName}</strong> by your mentor. This course is an essential part of your professional development and will help enhance your skills in the respective area.</p>
              <p><strong>Completion Date:</strong> ${completion_date}</p>
              <p>We kindly request that you complete the course by the specified date. This will ensure that you stay on track with your growth and meet your learning goals. If you encounter any issues or need assistance while completing the course, please don't hesitate to reach out to your mentor or the CAPDEV team.</p>
              <p>We appreciate your dedication to continuous learning and development.</p>
              <p>Best regards,</p>
              <p>CAPDEV Team</p>
              <div>
                <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
              </div>
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
    });
  } catch (error) {
    console.error('Unexpected error:', error);
    res.status(500).json({ message: 'Unexpected error occurred', error: error.message });
  }
});

module.exports = router;
