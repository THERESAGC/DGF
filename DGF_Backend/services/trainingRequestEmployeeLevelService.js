// services/trainingRequestEmployeeLevelService.js
const db = require('../config/db');
 
const storeEmployeeLevels = (requestid, designation_names) => {
    return new Promise((resolve, reject) => {
        // Create an array of query values for multiple inserts
        const values = designation_names.map(designation_name => [requestid, designation_name]);
 
        // SQL query to insert multiple designations for a given requestid
        const query = 'INSERT INTO request_designations (requestid, Designation_Name) VALUES ?';
 
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