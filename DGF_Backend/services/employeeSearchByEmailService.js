const db = require('../config/db');

// Function to get employees based on manager ID and email prefix
const searchEmployeesByManagerIdAndEmail = (managerid, emailPrefix) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.emp_id, e.emp_name, e.emp_email
            FROM employee e
            JOIN manager_employee_relationship mer ON e.emp_id = mer.emp_id
            WHERE mer.manager_id = ? AND e.emp_email LIKE ?;
        `;
        
        db.execute(query, [managerid, `${emailPrefix}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    searchEmployeesByManagerIdAndEmail
};