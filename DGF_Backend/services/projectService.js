const db = require('../config/db');

const getProjectsByServiceDivision = (service_division_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT ProjectID, ProjectName
            FROM projectname
            WHERE service_division_id = ?
        `;
        db.execute(query, [service_division_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getProjectsByServiceDivision,
};