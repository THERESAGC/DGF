const db = require('../config/db');

// Function to get notifications based on employee ID and role ID
const getNotifications = (empId, roleId) => {
    return new Promise((resolve, reject) => {
        let query;
        let params = [];

        if (roleId === 4) { // CapDev role
            query = `
                SELECT 
                    n.id,
                    n.requestid,
                    n.is_read,
                    ntr.requeststatus,
                    ntr.modifieddate,
                    ntr.requestedbyid,
                    e.name AS requestedby_name
                FROM notifications n
                JOIN newtrainingrequest ntr ON n.requestid = ntr.requestid
                JOIN logintable e ON ntr.requestedbyid = e.emp_id
                WHERE n.emp_id = ?
                ORDER BY ntr.modifieddate DESC;
            `;
            params.push(empId);
        } else if (roleId === 10) { // SPOC role
            query = `
                SELECT 
                    n.id,
                    n.requestid,
                    n.is_read,
                    ntr.requeststatus,
                    ntr.modifieddate,
                    ntr.requestedbyid,
                    e.name AS requestedby_name
                FROM notifications n
                JOIN newtrainingrequest ntr ON n.requestid = ntr.requestid
                JOIN logintable e ON ntr.requestedbyid = e.emp_id
                WHERE n.emp_id = ? AND ntr.createddate = ntr.modifieddate
                ORDER BY ntr.modifieddate DESC;
            `;
            params.push(empId);
        } else { // Requester role
            query = `
                SELECT 
                    n.id,
                    n.requestid,
                    n.is_read,
                    ntr.requeststatus,
                    ntr.modifieddate,
                    ntr.requestedbyid,
                    e.name AS requestedby_name
                FROM notifications n
                JOIN newtrainingrequest ntr ON n.requestid = ntr.requestid
                JOIN logintable e ON ntr.requestedbyid = e.emp_id
                WHERE n.emp_id = ?
                ORDER BY ntr.modifieddate DESC;
            `;
            params.push(empId);
        }

        db.execute(query, params, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


// Function to mark a notification as read
const markNotificationAsRead = (empId, notificationId) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE notifications
            SET is_read = TRUE
            WHERE id = ? AND emp_id = ?;
        `;
        db.execute(query, [notificationId, empId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};


module.exports = {
    getNotifications,
    markNotificationAsRead
};