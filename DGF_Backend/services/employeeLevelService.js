// services/employeeLevelService.js
const db = require('../config/db');

// Function to get all job titles from the database
const getAllJobTitles = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT Distinct(Designation_Name) FROM employee';

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
    getAllJobTitles
};
