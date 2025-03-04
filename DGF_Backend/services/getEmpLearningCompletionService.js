const db = require('../config/db'); // Assuming you have a database configuration file
const getEmployeeCompletionStatus = (requestid) => {
    return new Promise((resolve, reject) => {
        const query = `
        SELECT COUNT(*) AS totalEmployees,
               SUM(CASE WHEN status = 'Completed with Delay' OR status = 'Completed' THEN 1 ELSE 0 END) AS completedEmployees
        FROM emp_newtrainingrequested
        WHERE requestid = ?;
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
    getEmployeeCompletionStatus
};