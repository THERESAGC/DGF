const db = require('../config/db');

// Function to get all project names from the database
const getAllRoles = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM role';

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
    getAllRoles
};
