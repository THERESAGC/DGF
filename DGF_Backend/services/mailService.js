// services/mailService.js
const nodemailer = require("nodemailer");
const { smtpConfig } = require("../config/smtpConfig"); // Import your SMTP config

// Create a transporter using your SMTP configuration
const transporter = nodemailer.createTransport(smtpConfig);

// Function to send email with optional CC
// const sendEmail = (to, subject, text, cc = "") => {
//   console.log("Sending email to:", to); // Log the recipient
//   console.log("CC:", cc); // Log CC if provided

//   // Define the email options
//   // const mailOptions = {
//   //   from: "", // Replace this with your valid sender email address
//   //   to, // Recipient's email (this will be passed as a parameter)
//   //   subject, // Subject of the email
//   //   html: text, // Body of the email
//   //   cc, // Add the CC field, default is empty string (no CC)
//   // };
//   const mailOptions = {
//     from: "", // Replace with your valid sender email address
//     to, // Recipient's email (this will be passed as a parameter)
//     subject, // Subject of the email
//     html: text, // Body of the email
//     cc, // Add the CC field, default is empty string (no CC)
//     attachments: [
//       {
//         filename: 'image.jpg', // Name of the image
//         path: 'assets/image.jpg', // Path to your image
//         cid: 'signatureImage' // CID reference that matches the HTML image source
//       }
//     ]
//   };

const sendEmail = (to, subject, text, headerImagePath, footerImagePath, cc = "") => {
  const mailOptions = {
    from: "", // Replace with your valid sender email address
    to,
    subject,
    html: text,
    cc,
    attachments: [
      {
        filename: 'header-image.jpg',
        path: 'assets/MailHeader.png',
        cid: 'headerImage',
      },
      {
        filename: 'footer-image.jpg',
        path: 'assets/MailFooter.png',
        cid: 'footerImage',
      },
      {
        filename: 'image.jpg', // Name of the image
        path: 'assets/Capdevlogo.png', // Path to your image
        cid: 'signatureImage' // CID reference that matches the HTML image source
      },
         {
          filename: 'feedback-header.jpg',
          path: 'assets/Feedback.png',
          cid: 'feedback-headerImage',
        },
        {
          filename: 'ProgramStatusUpdate.png',
          path: 'assets/ProgramStatusUpdate.png',
          cid: 'programstatus-headerImage',
        },
        {
          filename: 'Reminder.png',
          path: 'assets/Reminder.png',
          cid: 'Reminder-headerImage',
        },
    ]
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
