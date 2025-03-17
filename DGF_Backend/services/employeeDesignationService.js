const db = require('../config/db');
 
// Function to get employees based on designation names
const getEmployeesByDesignation = (designationNames) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT e.emp_id, e.emp_name, e.emp_email, e.profile_image
            FROM employee e
            WHERE e.Designation_Name IN (${designationNames.map(() => '?').join(',')})
        `;
 
        console.log('Executing query:', query);
        console.log('With parameters:', designationNames);
 
        db.execute(query, designationNames, (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
            } else {
                console.log('Query results:', results);
                resolve(results);
            }
        });
    });
};
 
module.exports = {
    getEmployeesByDesignation
};