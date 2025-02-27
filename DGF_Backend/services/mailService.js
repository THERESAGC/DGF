// // services/mailService.js
// const nodemailer = require("nodemailer");
// const { smtpConfig } = require("../config/smtpConfig"); // Import your SMTP config

// // Create a transporter using your SMTP configuration
// const transporter = nodemailer.createTransport(smtpConfig);

// // Function to send email
// const sendEmail = (to, subject, text) => {
//     console.log("Sending email to:", to); // Log the recipient
//   // Define the email options
//   const mailOptions = {
//     from: "Swaroop.Bidkar@harbingergroup.com", // Sender's email (replace with your email)
//     to, // Recipient's email (this will be passed as a parameter)
//     subject, // Subject of the email
//     text, // Body of the email
//   };

//   // Return a promise for sending the email
//   return new Promise((resolve, reject) => {
//     transporter.sendMail(mailOptions, (error, info) => {
//       if (error) {
//         console.error("Error sending email:", error); // Log error
//         return reject(error); // Reject promise on error
//       }
//       console.log("Email sent:", info.response); // Log success response
//       return resolve(info); // Resolve promise on success
//     });
//   });
// };

// module.exports = { sendEmail };
/*
// services/mailService.js
const nodemailer = require("nodemailer");
const { smtpConfig } = require("../config/smtpConfig"); // Import your SMTP config

// Create a transporter using your SMTP configuration
const transporter = nodemailer.createTransport(smtpConfig);

// Function to send email
const sendEmail = (to, subject, text) => {
  console.log("Sending email to:", to); // Log the recipient
  // Define the email options
  const mailOptions = {
    from: "Swaroop.Bidkar@harbingergroup.com", // Replace this with your valid sender email address
    to, // Recipient's email (this will be passed as a parameter)
    subject, // Subject of the email
    text, // Body of the email
  };

  // Return a promise for sending the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error); // Log error
        return reject(error); // Reject promise on error
      }
      console.log("Email sent:", info.response); // Log success response
      return resolve(info); // Resolve promise on success
    });
  });
};

module.exports = { sendEmail };
*/
const nodemailer = require("nodemailer");
const { smtpConfig } = require("../config/smtpConfig"); // Import your SMTP config

// Create a transporter using your SMTP configuration
const transporter = nodemailer.createTransport(smtpConfig);

// Function to send email with optional CC
const sendEmail = (to, subject, text, cc = "") => {
  console.log("Sending email to:", to); // Log the recipient
  console.log("CC:", cc); // Log CC if provided

  // Define the email options
  const mailOptions = {
    from: "", // Replace this with your valid sender email address
    to, // Recipient's email (this will be passed as a parameter)
    subject, // Subject of the email
    text, // Body of the email
    cc, // Add the CC field, default is empty string (no CC)
  };

  // Return a promise for sending the email
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error); // Log error
        return reject(error); // Reject promise on error
      }
      console.log("Email sent:", info.response); // Log success response
      return resolve(info); // Resolve promise on success
    });
  });
};

module.exports = { sendEmail };
