const db = require('../config/db');

// Function to add a new project
const addProject = (projectName) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO projectname (ProjectName) VALUES (?)';
        
        db.execute(query, [projectName], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    addProject
};