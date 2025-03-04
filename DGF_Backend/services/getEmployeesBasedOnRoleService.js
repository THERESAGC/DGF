const db = require('../config/db');

// Function to get empdetails based on role = capdev
const getEmployeesBasedOnRole = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT emp_id,name FROM logintable WHERE role_id=4;`;
        
        db.execute(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getEmployeesBasedOnRole
};