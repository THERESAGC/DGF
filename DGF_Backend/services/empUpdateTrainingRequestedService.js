const db = require('../config/db');

// Function to update training request details
const updateEmpNewTrainingRequested = (emp_id, requestid, availablefrom, dailyband, availableonweekend) => {
    return new Promise((resolve, reject) => {
        const updateQuery = `
            UPDATE emp_newtrainingrequested
            SET availablefrom = ?, dailyband = ?, availableonweekend = ?
            WHERE emp_id = ? AND requestid = ?;
        `;

        db.execute(updateQuery, [availablefrom, dailyband, availableonweekend, emp_id, requestid], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    updateEmpNewTrainingRequested,
};