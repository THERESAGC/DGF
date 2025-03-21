const db = require('../config/db');

// Function to get all sources from the database
const getAllSources = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM source';

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
    getAllSources
};