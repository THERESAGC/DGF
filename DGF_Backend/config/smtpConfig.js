
  
  const smtpConfig = {
    host: "smtp.office365.com", // Office365 SMTP server
    port: 587,                  // Use port 587 for TLS
    secure: false,              // Set to false for TLS
    auth: {
      user: "Shreyansh.Barve@harbingergroup.com",  // Your Office365 email
      pass: "H@rb!ng3R@2025",    // Your Office365 password or app password
    },
    tls: {
      ciphers: "SSLv3",
    },
  };
  
  module.exports = { smtpConfig };
  