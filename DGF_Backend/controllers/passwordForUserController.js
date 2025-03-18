// controllers/passwordForUserController.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { sendEmail } = require('../services/mailService');

const requestPasswordChange = async (req, res) => {
  const { email } = req.body;

  try {
    // Query to fetch emp_id, email, and password from the logintable
    pool.execute('SELECT emp_id, email, password FROM logintable WHERE email = ?', [email], async (err, result) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Database query error' });
      }

      if (!result || result.length === 0) {
        return res.status(400).json({ message: 'User not found' });
      }

      const { emp_id, email: emp_email, password } = result[0];

      // Generate a token for password reset
      const token = jwt.sign({ email: emp_email, emp_id }, process.env.JWT_SECRET, { expiresIn: '1h' });
      const changePasswordLink = `http://localhost:5173/password-update?token=${token}`;

      // Email content with the existing password included
      const emailContent = `
     <p>Hello,</p>

        <p>Your new role in DGF is now active!</p>

        <p>To reset your password, click the link below:</p>

        <p><a href="${changePasswordLink}" target="_blank">Reset Your Password</a></p>

        <p>Additionally, here is your current password:</p>

        <p><strong>${password}</strong></p>

        <p>We recommend changing your password after logging in for the first time.</p>

        <p>Best regards,<br/>CAPDEV</p>

      `;

      try {
        // Send email with password reset link and existing password
        await sendEmail(emp_email, 'Password Change Request', emailContent);
        res.status(200).json({ message: 'Password change email sent successfully' });
      } catch (emailErr) {
        console.error('Email error:', emailErr);
        res.status(500).json({ message: 'Failed to send email' });
      }
    });
  } catch (error) {
    console.error('Error in sending password change email:', error);
    res.status(500).json({ message: 'Failed to send password change email' });
  }
};

const changePassword = async (req, res) => {
  const { token, existingPassword, newPassword } = req.body;

  // Validate if token and newPassword are present
  if (!token || !newPassword) {
    return res.status(400).json({ message: 'Token and new password are required' });
  }

  // Validate that newPassword is not empty
  if (newPassword.trim() === "") {
    return res.status(400).json({ message: 'New password cannot be empty' });
  }

  try {
    // Decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { emp_id } = decoded;

    // Query to fetch the current password from the login table
    pool.execute('SELECT password FROM logintable WHERE emp_id = ?', [emp_id], async (err, rows) => {
      if (err) {
        console.error('Database query error:', err);
        return res.status(500).json({ message: 'Database query error' });
      }

      if (rows.length === 0) {
        return res.status(400).json({ message: 'User not found in login table' });
      }

      const user = rows[0];

      // If the existing password is provided, check it against the stored password (plain text)
      if (existingPassword) {
        if (existingPassword.trim() === "") {
          return res.status(400).json({ message: 'Existing password cannot be empty' });
        }

        // If the password in the database is plain text, compare it directly
        if (existingPassword !== user.password) {
          return res.status(400).json({ message: 'Incorrect existing password' });
        }
      }

      // Update the password in the database without hashing
      pool.execute('UPDATE logintable SET password = ? WHERE emp_id = ?', [newPassword, emp_id], (updateErr) => {
        if (updateErr) {
          console.error('Error updating password:', updateErr);
          return res.status(500).json({ message: 'Failed to update password' });
        }

        res.status(200).json({ message: 'Password changed successfully' });
      });
    });
  } catch (error) {
    console.error('Error in changing password:', error);
    res.status(500).json({ message: 'Failed to change password' });
  }
};



module.exports = { requestPasswordChange, changePassword };
