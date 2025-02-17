// services/employeeSearchByEmailService.js
const db = require('../config/db');

// Function to get employees based on email search
const searchEmployeesByEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT emp_id, emp_name, emp_email
            FROM employee
            WHERE emp_email LIKE ?;
        `;
        
        // Using LIKE query to search for emails that match the provided email (case-insensitive)
        db.execute(query, [`${email}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    searchEmployeesByEmail
};
