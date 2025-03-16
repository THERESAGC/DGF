const db = require('../config/db');

// Function to add a new project
const addSeviceDivision = (service_name) => {
    return new Promise((resolve, reject) => {
        const query = 'INSERT INTO service_division (service_name) VALUES (?)';
        
        db.execute(query, [service_name], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    addSeviceDivision
};