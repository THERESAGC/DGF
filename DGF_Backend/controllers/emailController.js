/*
// controllers/emailController.js
const { sendEmail } = require("../services/mailService");

const handleSubmit = async (req, res) => {
  const requestBody = req.body; // Get the request body from the frontend
    console.log("Request body:", requestBody);
    console.log(requestBody.requestid)
  try {
    // 1. Send email to the person who made the request (requestedbyid)
    await sendEmail(
    //   "sonia.sahu@harbingergroup.com", // The email of the person who made the request
      "swaroop.bidkar@harbingergroup.com",
      "Training Request Confirmation",
      // `Hello, your training request with ID: ${requestBody.requestid} has been successfully submitted. We will notify you once it is processed.`
      `Thank you for taking cognizance of your team member learning need and growth and for reaching out to CAPDEV.
Your Request number is ${requestBody.requestid} Please watch in for status update Happy Learning CAPDEV.
`
    );

    // 2. Send email to the internal team (admin or designated team responsible for processing)
    await sendEmail(
    //   "champ@harbingergroup.com", // The email of the internal team or admin
      "swaroop.bidkar@harbingergroup.com",
      "New Training Request Submitted",
      `A new training request has been submitted by ${requestBody.requestedbyid}. 
      Please review the details and process it accordingly.
      Training Request ID: ${requestBody.requestid}`
    );

    // Send a response indicating successful email sending
    res.status(200).json({ message: "Request processed and emails sent." });
  } catch (error) {
    console.error("Error during email sending:", error);
    res.status(500).json({ error: "Error during email sending" });
  }
};

module.exports = { handleSubmit };

*/

// controllers/emailController.js
const { sendEmail } = require("../services/mailService");

const handleSubmit = async (req, res) => {
  const requestBody = req.body; // Get the request body from the frontend
  console.log("Request body:", requestBody);
  console.log(requestBody.requestid);
  
  // Email variables
  const userEmail = ""; // Email of the person who made the request (requestedbyid)
  const internalTeamEmail = ""; // Email of the internal team or admin
  const ccEmail = "shruti.rawat@harbingergroup.com"; // CC email (e.g., a manager or supervisor)

  try {
    // 1. Send email to the person who made the request (requestedbyid)
    await sendEmail(
      "swaroop.bidkar@harbingergroup.com", // The email of the person who made the request
      "Training Request Confirmation",
      `Thank you for taking cognizance of your team member's learning need and growth and for reaching out to CAPDEV.
Your Request number is ${requestBody.requestid}. Please watch for status updates. Happy Learning, CAPDEV.`,
      ccEmail // Add CC email to the requestor's email
    );

    // 2. Send email to the internal team (admin or designated team responsible for processing)
    await sendEmail(
      "sonia.sahu@harbingergroup.com", // The email of the internal team or admin
      "New Training Request Submitted",
      `A new training request has been submitted by ${requestBody.requestedbyid}.
Please review the details and process it accordingly.
Training Request ID: ${requestBody.requestid}`,
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
