const db = require('../config/db');

// Function to get managers based on search query by name
const searchManagersByName = (name) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT emp_id AS manager_id, emp_name AS manager_name, emp_email AS manager_email, profile_image AS manager_profile_image
        FROM employee
        WHERE emp_name LIKE ? AND emp_id IN (SELECT DISTINCT manager_id FROM employee WHERE manager_id IS NOT NULL);
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
    searchManagersByName
};