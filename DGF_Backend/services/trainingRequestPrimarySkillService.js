const db = require('../config/db');

const storePrimarySkills = (requestid, primary_skill_ids) => {
    return new Promise((resolve, reject) => {
        // Create an array of query values for multiple inserts
        const values = primary_skill_ids.map(primary_skill_id => [requestid, primary_skill_id]);

        // SQL query to insert multiple primary skills for a given requestid
        const query = 'INSERT INTO Request_Primary_Skills (requestid, primaryskill_id) VALUES ?';

        // Use query method and pass the array of values
        db.query(query, [values], (err, results) => {
            if (err) {
                return reject(err); // Reject the promise if an error occurs
            }
            resolve(results); // Resolve the promise with the results if successful
        });
    });
};

module.exports = {
    storePrimarySkills
};