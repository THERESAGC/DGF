const db = require('../config/db');

// Function to insert multiple new training requests
const insertMultipleEmpNewTrainingRequested = async (employees) => {
    return new Promise((resolve, reject) => {
        const insertQuery = `
            INSERT INTO emp_newtrainingrequested (emp_id, availablefrom, dailyband, availableonweekend, requestid)
            VALUES (?, ?, ?, ?, ?);
        `;

        const promises = employees.map(employee => {
            const { emp_id, availablefrom, dailyband, availableonweekend, requestid } = employee;
            return new Promise((resolve, reject) => {
                db.execute(insertQuery, [emp_id, availablefrom, dailyband, availableonweekend, requestid], (err, result) => {
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
    insertMultipleEmpNewTrainingRequested,
};