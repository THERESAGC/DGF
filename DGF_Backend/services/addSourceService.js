const db = require('../config/db');

// Function to add a new source
const addSource = (source_name) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO source (source_name) VALUES (?)';
        
        db.execute(query, [source_name], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    addSource
};