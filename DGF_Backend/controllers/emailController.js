// // controllers/emailController.js
// const { sendEmail } = require("../services/mailService");

// const handleSubmit = async (req, res) => {
//   const requestBody = req.body; // Get the request body from the frontend
//   console.log("Request body:", requestBody);
//   console.log(requestBody.requestid);
  
//   // Email variables
//   const userEmail = ""; // Email of the person who made the request (requestedbyid)
//   const internalTeamEmail = ""; // Email of the internal team or admin
//   const ccEmail = "shruti.rawat@harbingergroup.com"; // CC email (e.g., a manager or supervisor)

//   try {
//     // 1. Send email to the person who made the request (requestedbyid)
//     await sendEmail(
//       "swaroop.bidkar@harbingergroup.com", // The email of the person who made the request
//       "Training Request Confirmation",
//       `<p>Thank you for taking cognizance of your team member's learning need and growth and for reaching out to CAPDEV.</p>
//        <p><strong>Your Request number is</strong> ${requestBody.requestid}. <strong>Please watch for status updates.</strong></p>
//         <p>Happy Learning, CAPDEV.</p>
// `,
//       ccEmail // Add CC email to the requestor's email
//     );

//     // 2. Send email to the internal team (admin or designated team responsible for processing)
//     await sendEmail(
//       "sonia.sahu@harbingergroup.com", // The email of the internal team or admin
//       "New Training Request Submitted",
//       `<p><strong>A new training request has been submitted by</strong> ${requestBody.requestedbyid}.</p>
//       <p><strong>Please review the details and process it accordingly.</strong></p>
//       <p><strong>Training Request ID:</strong> ${requestBody.requestid}</p>`,
//       ccEmail // Add CC email to the internal team email
//     );

//     // Send a response indicating successful email sending
//     res.status(200).json({ message: "Request processed and emails sent." });
//   } catch (error) {
//     console.error("Error during email sending:", error);
//     res.status(500).json({ error: "Error during email sending" });
//   }
// };

// module.exports = { handleSubmit };

// controllers/emailController.js
const { sendEmail } = require("../services/mailService");

const handleSubmit = async (req, res) => {
  const requestBody = req.body; // Get the request body from the frontend
  console.log("Request body:", requestBody);
  console.log(requestBody.requestid);
  
  // Email variables
  const userEmail = requestBody.requestedbyid; // Email of the person who made the request (requestedbyid)
  const internalTeamEmail = ""; // Email of the internal team or admin
  const ccEmail = ""; // CC email (e.g., a manager or supervisor)

  try {
    // 1. Send email to the person who made the request (requestedbyid)
    await sendEmail(
      "swaroop.bidkar@harbingergroup.com", // The email of the person who made the request
      `Acknowledgment of Learning Request ${requestBody.requestid}`, // Subject
      `
        <html>
          <body>
            <!-- Program Status Header Image -->
            <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
            <br><br>

            <p>Dear ${requestBody.requestedbyid},</p>

            <p>We trust this message finds you well. This is to acknowledge that we have received your Learning request for the below mentioned team member/s.</p>

            <p>Thank you for taking the initiative to prioritize the professional development of your team.</p>

            <p><strong>Name</strong><br>
            <strong>Current Project</strong><br>
            <strong>Delivery Unit</strong><br>
            <strong>Daily Learning slot you have suggested</strong></p><br>

           

            <p>Your commitment to enhancing the skills and knowledge of your team is commendable, and we understand the importance of this request for their growth and contribution to our projects.</p>

            <p>Please be advised that we have initiated the necessary steps to review and process your Learning request. We understand that the final approval rests with the SPOC team, and we will keep you informed of any developments in this regard.</p>

            <p>In the meantime, if there are any additional details or requirements you'd like to share, or if you have any questions about the process, please feel free to reach out to <strong>${requestBody.spoCRole}</strong>.</p>

            <p>We appreciate your patience as we work through the approval process. Your dedication to the professional development of your team is instrumental in our collective success.</p>

            <p>Thank you once again for your proactive approach to Capability Development.</p>

            <br><br>
            <!-- Signature Image -->
            <img src="cid:signatureImage" alt="CAPDEV Logo" style="width: 100px; height: auto;" />

            <br><br>
            <!-- Footer Image -->
            <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
          </body>
        </html>
      `,
      ccEmail // Add CC email to the requestor's email
    );

    // 2. Send email to the internal team (admin or designated team responsible for processing)
    await sendEmail(
      "sonia.sahu@harbingergroup.com", // The email of the internal team or admin
      `New Training Request Submitted`, // Subject
      `
        <html>
          <body>
            <!-- Program Status Header Image -->
            <img src="cid:programstatus-headerImage" alt="Program Status Header" style="width: 100%; height: auto;" />
            <br><br>

            <p><strong>A new training request has been submitted by</strong> ${requestBody.requestedbyid}.</p>
            <p><strong>Please review the details and process it accordingly.</strong></p>
            <p><strong>Training Request ID:</strong> ${requestBody.requestid}</p>

            <br><br>
            <!-- Footer Image -->
            <img src="cid:footerImage" alt="Footer Image" style="width: 100%; height: auto;" />
          </body>
        </html>
      `,
      ccEmail // Add CC email to the internal team email
    );

    // Send a response indicating successful email sending
    res.status(200).json({ message: "Request processed and emails sent." });
  } catch (error) {
    console.error("Error during email sending:", error);
    res.status(500).json({ error: "Error during email sending" });
  }
};

module.exports = { handleSubmit };
