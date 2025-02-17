const db = require('../config/db');

const getMaxRequestId = () => {
    return new Promise((resolve, reject) => {
        // SQL query to get the max requestid from the table
        const query = 'SELECT MAX(requestid) AS maxRequestId FROM newtrainingrequest';
        
        db.execute(query, [], (err, results) => {
            if (err) {
                reject(err); // Reject if error occurs
            } else {
                // If no records are found, set maxRequestId to 0
                const maxRequestId = results[0].maxRequestId || 0;
                resolve(maxRequestId + 1); // Return maxRequestId incremented by 1
            }
        });
    });
};

module.exports = {
    getMaxRequestId
};
