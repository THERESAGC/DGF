const db = require('../config/db');

// Function to get employees by partial email
const getEmployeesByPartialEmail = (email) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT emp_id, emp_name, emp_email, profile_image
            FROM employee
            WHERE emp_email LIKE ?;
        `;

        db.execute(query, [`%${email}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getEmployeesByPartialEmail
};