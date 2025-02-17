// services/projectService.js
const db = require('../config/db');

// Function to get all project names from the database
const getAllProjects = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT ProjectID, ProjectName FROM projectname';

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
    getAllProjects
};
