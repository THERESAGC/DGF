const db = require('../config/db');

// Function to get data from emp_newtrainingrequested based on requestid
const getEmpNewTrainingRequestedByRequestId = (requestid) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                en.emp_id,
                e.emp_name,
                en.availablefrom,
                en.dailyband,
                en.availableonweekend,
                en.requestid,
                en.emailsentstatus,
                en.emailsentdate,
                en.comment,
                en.status,
                en.createddate,
                e.profile_image
            FROM emp_newtrainingrequested en
            JOIN employee e ON en.emp_id = e.emp_id
            WHERE en.requestid = ?;
        `;
        
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