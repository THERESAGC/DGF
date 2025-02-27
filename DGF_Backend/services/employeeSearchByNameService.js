const db = require('../config/db');
 
// Function to get employees based on search query by name and manager ID
const searchEmployeesByName = (managerId, name) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.emp_id, e.emp_name, e.emp_email,e.profile_image
            FROM employee e
            JOIN manager_employee_relationship mer ON e.emp_id = mer.emp_id
            WHERE mer.manager_id = ? AND e.emp_name LIKE ?;
        `;
       
        // Using LIKE query to search for names that start with the provided string (case-insensitive)
        db.execute(query, [managerId, `${name}%`], (err, results) => {
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
 