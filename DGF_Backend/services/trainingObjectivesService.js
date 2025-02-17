// services/trainingService.js
const db = require('../config/db');

// Function to get training objectives based on source_id
const getTrainingObjectivesBySource = (source_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT training_id, training_name
            FROM training_obj
            WHERE source_id = ?;
        `;
        
        db.execute(query, [source_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getTrainingObjectivesBySource
};
