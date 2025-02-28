const db = require('../config/db');

// Function to get employees based on designation IDs
const getEmployeesByDesignation = (designationIds) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.emp_id, e.emp_name, e.emp_email, e.profile_image
            FROM employee e
            JOIN employee_designation ed ON e.emp_id = ed.emp_id
            WHERE ed.designation_id IN (${designationIds.map(() => '?').join(',')})
        `;
        
        // console.log('Executing query:', query);
        // console.log('With parameters:', designationIds);

        db.execute(query, designationIds, (err, results) => {
            if (err) {
                // console.error('Error executing query:', err);
                reject(err);
            } else {
                // console.log('Query results:', results);
                resolve(results);
            }
        });
    });
};

module.exports = {
    getEmployeesByDesignation
};