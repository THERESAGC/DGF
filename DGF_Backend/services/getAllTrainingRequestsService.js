const db = require('../config/db');

// Function to get all training requests
const getAllTrainingRequests = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM newtrainingrequest';
        
        db.query(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getAllTrainingRequests
};