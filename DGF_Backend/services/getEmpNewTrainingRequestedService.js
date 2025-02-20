const db = require('../config/db');

// Function to get data from emp_newtrainingrequested based on requestid
const getEmpNewTrainingRequestedByRequestId = (requestid) => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM emp_newtrainingrequested WHERE requestid = ?';
        
        db.execute(query, [requestid], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getEmpNewTrainingRequestedByRequestId
};