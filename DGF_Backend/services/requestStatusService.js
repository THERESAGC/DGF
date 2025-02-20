const db = require('../config/db');

// Function to update the request status
const updateRequestStatus = (requestId, status, roleId, approverId) => {
    return new Promise((resolve, reject) => {
        let requestStatus;
        switch (status) {
            case 'approve':
                if (roleId === 10) {
                    requestStatus = 'spoc approved';
                } else if (roleId === 4) {
                    requestStatus = 'capdev approved';
                } else {
                    requestStatus = 'approved';
                }
                break;
            case 'reject':
                requestStatus = 'rejected';
                break;
            case 'suspend learning':
                requestStatus = 'learning suspended';
                break;
            case 'need clarification':
                requestStatus = 'clarification requested';
                break;
            default:
                return reject(new Error('Invalid status'));
        }

        const query = `
            UPDATE newtrainingrequest
            SET requeststatus = ?, approvedby = ?
            WHERE requestid = ?;
        `;

        db.execute(query, [requestStatus, approverId, requestId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    updateRequestStatus
};