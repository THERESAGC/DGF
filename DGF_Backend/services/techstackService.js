// services/techstackService.js
const db = require('../config/db');

// Function to get all techstack data from the database
const getAllTechStacks = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT stack_id, stack_name FROM techstack';

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
    getAllTechStacks
};
