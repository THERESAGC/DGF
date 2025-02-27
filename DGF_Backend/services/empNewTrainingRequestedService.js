const db = require('../config/db');

// Function to insert a new training request
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

// Function to delete an employee from a training request
const deleteEmployeeFromTrainingRequest = (empId, requestId) => {
    return new Promise((resolve, reject) => {
        const deleteQuery = `
            DELETE FROM emp_newtrainingrequested
            WHERE emp_id = ? AND requestid = ?;
        `;
        db.execute(deleteQuery, [empId, requestId], (err, result) => {
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
    deleteEmployeeFromTrainingRequest,
};