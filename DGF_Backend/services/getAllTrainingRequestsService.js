const db = require('../config/db');

const getAllTrainingRequests = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM newtrainingrequest'; // SQL query to select all rows

        db.execute(query, [], (err, results) => {
            if (err) {
                reject(err); // Reject if error occurs
            } else {
                resolve(results); // Resolve with the result set (all rows)
            }
        });
    });
};

module.exports = {
    getAllTrainingRequests
};
