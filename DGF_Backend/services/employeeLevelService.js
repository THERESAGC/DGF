// services/employeeLevelService.js
const db = require('../config/db');

// Function to get all job titles from the database
const getAllJobTitles = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT id, job_title FROM employee_level';

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
