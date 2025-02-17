const db = require('../config/db');

const insertEmpNewTrainingRequested = async (emp_id, availablefrom, dailyband, availableonweekend, requestid) => {
    return new Promise((resolve, reject) => {
        // Insert data into emp_newtrainingrequested
        const insertQuery = `
            INSERT INTO emp_newtrainingrequested (emp_id, availablefrom, dailyband, availableonweekend, requestid)
            VALUES (?, ?, ?, ?, ?);
        `;

        db.execute(insertQuery, [emp_id, availablefrom, dailyband, availableonweekend, requestid], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

module.exports = {
    insertEmpNewTrainingRequested,
};
