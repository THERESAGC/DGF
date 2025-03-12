const db = require('../config/db');

const updateUserStatus = (userId, status) => {
    return new Promise((resolve, reject) => {
        const query = 'UPDATE logintable SET status = ? WHERE emp_id = ?';
        db.execute(query, [status, userId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    updateUserStatus,
};