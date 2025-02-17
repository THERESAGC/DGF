//service/roleService.js
const db = require('../config/db');

// Function to get sources based on role ID from the database
const getSourcesByRole = (role_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT source.source_id, source.source_name
            FROM source
            JOIN role_source_assign ON source.source_id = role_source_assign.source_id
            WHERE role_source_assign.role_id = ?;
        `;

        db.execute(query, [role_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getSourcesByRole
};
