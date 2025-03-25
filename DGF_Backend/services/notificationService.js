const db = require('../config/db');

// Function to get notifications for a user
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
                        n.message,
                        ntr.modifieddate,
                        ntr.requestedbyid,
                        e.name AS requestedby_name,
                        ntr.approvedby,
                        a.name AS approvedby_name,
                        ntr.requestonbehalfof,
                        r.name AS requestonbehalfof_name,
                        e.profile_image AS requestedby_profile_image,
                        a.profile_image AS approvedby_profile_image,
                        r.profile_image AS requestonbehalfof_profile_image
                    FROM notifications n
                    JOIN newtrainingrequest ntr ON n.requestid = ntr.requestid
                    JOIN logintable e ON ntr.requestedbyid = e.emp_id
                    LEFT JOIN logintable a ON ntr.approvedby = a.emp_id
                    LEFT JOIN logintable r ON ntr.requestonbehalfof = r.emp_id
                    WHERE n.emp_id = ?
                    ORDER BY n.created_at DESC;
                `;
                params.push(empId);
            } else if (roleId === 10) { // SPOC role
                query = `
                    SELECT
                        n.id,
                        n.requestid,
                        n.is_read,
                        n.message,
                        ntr.modifieddate,
                        ntr.requestedbyid,
                        e.name AS requestedby_name,
                        ntr.approvedby,
                        a.name AS approvedby_name,
                        ntr.requestonbehalfof,
                        r.name AS requestonbehalfof_name,
                        e.profile_image AS requestedby_profile_image,
                        a.profile_image AS approvedby_profile_image,
                        r.profile_image AS requestonbehalfof_profile_image
                    FROM notifications n
                    JOIN newtrainingrequest ntr ON n.requestid = ntr.requestid
                    JOIN logintable e ON ntr.requestedbyid = e.emp_id
                    LEFT JOIN logintable a ON ntr.approvedby = a.emp_id
                    LEFT JOIN logintable r ON ntr.requestonbehalfof = r.emp_id
                    WHERE n.emp_id = ? AND ntr.createddate = ntr.modifieddate
                           ORDER BY n.created_at DESC;
                `;
                params.push(empId);
            } else { // Requester role
                query = `
                    SELECT
                        n.id,
                        n.requestid,
                        n.is_read,
                        n.,
                        ntr.modifieddate,
                        ntr.requestedbyid,
                        e.name AS requestedby_name,
                        ntr.approvedby,
                        a.name AS approvedby_name,
                        ntr.requestonbehalfof,
                        r.name AS requestonbehalfof_name,
                        e.profile_image AS requestedby_profile_image,
                        a.profile_image AS approvedby_profile_image,
                        r.profile_image AS requestonbehalfof_profile_image
                    FROM notifications n
                    JOIN newtrainingrequest ntr ON n.requestid = ntr.requestid
                    JOIN logintable e ON ntr.requestedbyid = e.emp_id
                    LEFT JOIN logintable a ON ntr.approvedby = a.emp_id
                    LEFT JOIN logintable r ON ntr.requestonbehalfof = r.emp_id
                    WHERE n.emp_id = ? AND ntr.requestedbyid = ?
                          ORDER BY n.created_at DESC;
                `;
                params.push(empId, empId);
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

// Function to create a new notification when the status changes
const createNotificationOnStatusChange = (requestId, approverId) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT requestedbyid, requestonbehalfof, requeststatus
            FROM newtrainingrequest
            WHERE requestid = ?;
        `;
        db.execute(query, [requestId], (err, results) => {
            if (err) {
                reject(err);
            } else {
                const { requestedbyid, requestonbehalfof, requeststatus } = results[0];
                const recipients = [requestedbyid, requestonbehalfof].filter(empId => empId !== approverId);

                if (recipients.length > 0) {
                    const notificationQuery = `
                        INSERT INTO notifications (emp_id, requestid, is_read, message)
                        VALUES (?, ?, FALSE, ?)
                        ON DUPLICATE KEY UPDATE message = VALUES(message);
                    `;
                    const message = `Status changed to ${requeststatus}`;
                    const notificationPromises = recipients.map(empId => {
                        return new Promise((resolve, reject) => {
                            db.execute(notificationQuery, [empId, requestId, message], (err, results) => {
                                if (err) {
                                     console.log('Notification;--------------------', err);
                                    reject(err);
                                } else {
                                    console.log('Notification created:--------------------', results);
                                    resolve(results);
                                    
                                }
                            });
                        });
                    });

                    Promise.all(notificationPromises)
                        .then(results => resolve(results))
                        .catch(err => reject(err));
                } else {
                    resolve([]);
                }
            }
        });
    });
};

// New function to create a notification when a request is assigned
const fetchNotificationDetailsOnAssignment = (requestId, emp_id) => {
    return new Promise((resolve, reject) => {
        const insertNotificationQuery = `
            INSERT INTO notifications (requestid, emp_id, is_read, message) 
            VALUES (?, ?, 0, 'Ticket has been assigned to you!')
            ON DUPLICATE KEY UPDATE message = VALUES(message);
        `;

        db.execute(insertNotificationQuery, [requestId, emp_id], (err, results) => {
            if (err) {
                console.error('Error inserting notification:', err); // Log the error for debugging
                reject(new Error('Failed to insert notification into the database.'));
            } else {
                resolve({ emp_id }); // Resolve with the employee ID
            }
        });
    });
};

module.exports = {
    getNotifications,
    markNotificationAsRead,
    createNotificationOnStatusChange,
    fetchNotificationDetailsOnAssignment
};