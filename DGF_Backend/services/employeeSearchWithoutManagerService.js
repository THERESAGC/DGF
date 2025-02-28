const db = require('../config/db');

// Function to get employees based on search query by name without manager ID
const searchEmployeesByNameWithoutManager = (name) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.emp_id, e.emp_name, e.emp_email, e.profile_image
            FROM employee e
            WHERE e.emp_name LIKE ?;
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
    searchEmployeesByNameWithoutManager
};