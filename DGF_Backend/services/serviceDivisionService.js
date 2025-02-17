const db = require('../config/db');  // Make sure this points to your database configuration

// Function to fetch all services from the service_division table
const getAllServices = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM service_division';  // Query to select all services

        db.execute(query, (err, results) => {
            if (err) {
                reject(err);  // Reject the promise in case of an error
            } else {
                resolve(results);  // Resolve with the query results
            }
        });
    });
};

module.exports = {
    getAllServices,
};
