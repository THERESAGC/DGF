const db = require('../config/db');

const addUser = ({ emp_id, name, email, password, role_id, profile_image, created_on, status }) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO logintable (emp_id, name, email, password, role_id, profile_image, created_on, status)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const params = [emp_id, name, email, password, role_id, profile_image, created_on, status];

        db.execute(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    addUser
};