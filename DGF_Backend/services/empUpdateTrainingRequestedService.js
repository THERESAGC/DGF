const db = require('../config/db');

// Function to update multiple training request details
const updateMultipleEmpNewTrainingRequested = (employees) => {
    return new Promise((resolve, reject) => {
        const updateQuery = `
            UPDATE emp_newtrainingrequested
            SET availablefrom = ?, dailyband = ?, availableonweekend = ?
            WHERE emp_id = ? AND requestid = ?;
        `;

        const promises = employees.map(employee => {
            const { emp_id, requestid, availablefrom, dailyband, availableonweekend } = employee;
            return new Promise((resolve, reject) => {
                db.execute(updateQuery, [availablefrom, dailyband, availableonweekend, emp_id, requestid], (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        });

        Promise.all(promises)
            .then(results => resolve(results))
            .catch(err => reject(err));
    });
};

module.exports = {
    updateMultipleEmpNewTrainingRequested,
};