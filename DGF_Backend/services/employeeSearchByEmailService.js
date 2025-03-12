const db = require('../config/db');
 
// Function to get employees based on manager ID and email prefix
const searchEmployeesByManagerIdAndEmail = (managerId, emailPrefix) => {
    return new Promise((resolve, reject) => {
        const query = `
            WITH RECURSIVE EmployeeHierarchy AS (
                SELECT
                    emp_id,
                    emp_name,
                    manager_id
                FROM employee
                WHERE emp_id = ?
               
                UNION ALL
               
                SELECT
                    e.emp_id,
                    e.emp_name,
                    e.manager_id
                FROM employee e
                INNER JOIN EmployeeHierarchy eh
                    ON e.manager_id = eh.emp_id
            )
            SELECT DISTINCT
                e.emp_id,
                e.emp_name,
                e.emp_email,
                e.profile_image
            FROM EmployeeHierarchy eh
            JOIN employee e ON eh.emp_id = e.emp_id
            WHERE e.emp_email LIKE ?;
        `;
       
        db.execute(query, [managerId, `${emailPrefix}%`], (err, results) => {
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