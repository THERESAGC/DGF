const db = require('../config/db');

// Function to search projects by name starting with a specific letter
const searchProjectsByName = (letter) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ProjectID, ProjectName 
            FROM projectname 
            WHERE ProjectName LIKE ?
            ORDER BY ProjectName;
        `;
        
        db.execute(query, [`${letter}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    searchProjectsByName
};