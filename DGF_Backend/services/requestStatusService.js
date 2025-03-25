const db = require('../config/db');
 
// Function to update the request status
const updateRequestStatus = (requestId, status, roleId, approverId) => {
    return new Promise((resolve, reject) => {
        let requestStatus;
        switch (status) {
            case 'approve':
                if (roleId === 10) {
                    requestStatus = 'spoc approved';
                } else {
                    requestStatus = 'capdev approved';
                }
                break;
            case 'reject':
                requestStatus = 'rejected';
                break;
            case 'hold': //for suspended learning
                requestStatus = 'request suspended';
                break;
            case 'needClarification':
                requestStatus = 'clarification requested';
                break;
            default:
                return reject(new Error('Invalid status'));
        }
        let query = null;
        if (requestStatus === 'capdev approved' || requestStatus === 'spoc approved') {
         query = `
            UPDATE newtrainingrequest
            SET requeststatus = ?, approvedby = ?, AssignedTo="HS609"
            WHERE requestid = ?;
        `;
        }
        else{
        query = `
            UPDATE newtrainingrequest
            SET requeststatus = ?, approvedby = ?
            WHERE requestid = ?;
        `;
        }
 
        db.execute(query, [requestStatus, approverId, requestId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                // If successful, now insert into notifications
                const notificationQuery = `
                    INSERT INTO notifications (emp_id, requestid, is_read,message)
                    SELECT emp_id, ?, FALSE,? FROM logintable;
                `;
                const notificationParams = [requestId,requestStatus]; // Only need requestid,requeststatus for this query
 
                // Log the notification query and params
                console.log('Executing notification query:', notificationQuery);
                console.log('With notification params:', notificationParams);
 
                db.execute(notificationQuery, notificationParams, (err, notificationResults) => {
                    if (err) {
                        reject(err); // Reject if there's an error in inserting into notifications
                    } else {
                        resolve({ requeststatus: results, notification: notificationResults }); // Return both results
                    }
                });
            
 

             
            }
        });
    });
};
 
module.exports = {
    updateRequestStatus
};
 