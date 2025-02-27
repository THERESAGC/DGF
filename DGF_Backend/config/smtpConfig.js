// config/smtpConfig.js
// module.exports.smtpConfig = {
//     service: 'Office365', // Using Office365
//     auth: {
//       user: 'Swaroop.Bidkar@harbingergroup.com',  // Replace with your email
//       pass: '',          // Replace with your email password or app password
//     },
//     tls: {
//       ciphers: 'SSLv3', // Make sure the correct ciphers are used
//     },
//   };
  
  const smtpConfig = {
    host: "smtp.office365.com", // Office365 SMTP server
    port: 587,                  // Use port 587 for TLS
    secure: false,              // Set to false for TLS
    auth: {
      user: "Swaroop.Bidkar@harbingergroup.com",  // Your Office365 email
      pass: "",    // Your Office365 password or app password
    },
    tls: {
      ciphers: "SSLv3",
    },
  };
  
  module.exports = { smtpConfig };
  