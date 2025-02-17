// services/employeeService.js
const db = require('../config/db');

// Function to get employees based on search query by name
const searchEmployeesByName = (name) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT emp_id, emp_name, emp_email
            FROM employee
            WHERE emp_name LIKE ?;
        `;
        
        // Using LIKE query to search for names that start with the provided string (case-insensitive)
        db.execute(query, [`${name}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    searchEmployeesByName
};
