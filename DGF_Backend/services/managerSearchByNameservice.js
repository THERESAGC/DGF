const db = require('../config/db');

// Function to get managers based on search query by name
const searchManagersByName = (name) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT manager_id, manager_name, manager_email
            FROM manager
            WHERE manager_name LIKE ?;
        `;
        
        // Using LIKE query to search for names that start with the provided string (case-insensitive)
        db.execute(query, [`${name}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    searchManagersByName
};