const db = require('../config/db');

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
    deleteEmployeeFromTrainingRequest,
};