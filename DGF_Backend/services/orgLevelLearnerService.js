const db = require('../config/db');

const getOrgLevelLearnerDataService = (emp_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                emp_newtrainingrequested.emp_id, 
                emp_newtrainingrequested.requestid, 
                newtrainingrequest.requeststatus AS status, 
                emp_newtrainingrequested.createddate,
                (SELECT COUNT(DISTINCT requestid) 
                 FROM emp_newtrainingrequested 
                 WHERE emp_id = ? 
                 AND requestid IN (
                     SELECT requestid 
                     FROM newtrainingrequest 
                     WHERE requeststatus NOT IN ('rejected', 'Completed', 'Completed with Delay', 'Incomplete', 'Learning Suspended') 
                     AND org_level = 1
                 )) AS total_requests
            FROM 
                emp_newtrainingrequested
            LEFT JOIN
                newtrainingrequest
            ON
                emp_newtrainingrequested.requestid = newtrainingrequest.requestid
            WHERE 
                newtrainingrequest.requeststatus NOT IN ('rejected', 'Completed', 'Completed with Delay', 'Incomplete', 'Learning Suspended')
                AND newtrainingrequest.org_level = 1
                AND emp_newtrainingrequested.emp_id = ?
            GROUP BY 
                emp_newtrainingrequested.emp_id, 
                emp_newtrainingrequested.requestid, 
                newtrainingrequest.requeststatus,
                emp_newtrainingrequested.createddate;
        `;

        db.execute(query, [emp_id, emp_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve({
                    total_requests: results.length > 0 ? results[0].total_requests : 0,
                    requests: results
                });
            }
        });
    });
};

module.exports = {
    getOrgLevelLearnerDataService
};