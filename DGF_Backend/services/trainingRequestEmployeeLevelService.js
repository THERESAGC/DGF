// services/trainingRequestEmployeeLevelService.js
const db = require('../config/db');

const storeEmployeeLevels = (requestid, employee_level_ids) => {
    return new Promise((resolve, reject) => {
        // Create an array of query values for multiple inserts
        const values = employee_level_ids.map(employee_level_id => [requestid, employee_level_id]);

        // SQL query to insert multiple employee levels for a given requestid
        const query = 'INSERT INTO training_request_employee_level (requestid, employee_level_id) VALUES ?';

        // Use query method and pass the array of values
        db.query(query, [values], (err, results) => {
            if (err) {
                return reject(err); // Reject the promise if an error occurs
            }
            resolve(results); // Resolve the promise with the results if successful
        });
    });
};

module.exports = {
    storeEmployeeLevels
};
