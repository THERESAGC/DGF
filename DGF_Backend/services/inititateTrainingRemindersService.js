
const db = require('../config/db');

const createReminder = (reminder) => {
    return new Promise((resolve, reject) => {
        const query = `
            INSERT INTO initiate_training_reminders (assignment_id, reminder_date, reminder_text, created_by)
            VALUES (?, ?, ?, ?)
        `;
        const values = [reminder.assignment_id, reminder.reminder_date, reminder.reminder_text, reminder.created_by];
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return reject(err); // Reject the promise with the error
            }
            resolve(result); // Resolve the promise with the result
        });
    });
};

const deleteReminder = (reminder_id) => {
    return new Promise((resolve, reject) => {
        const query = `DELETE FROM initiate_training_reminders WHERE reminder_id = ?`;
        db.query(query, [reminder_id], (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return reject(err); // Reject the promise with the error
            }
            resolve(result); // Resolve the promise with the result
        });
    });
};

// const updateReminder = (reminder_id, updatedFields) => {
//     return new Promise((resolve, reject) => {
//         const query = `
//             UPDATE initiate_training_reminders
//             SET reminder_date = ?, reminder_text = ?
//             WHERE reminder_id = ?
//         `;
//         const values = [updatedFields.reminder_date, updatedFields.reminder_text, reminder_id];
//         db.query(query, values, (err, result) => {
//             if (err) {
//                 console.error('Error executing query:', err.message);
//                 return reject(err); // Reject the promise with the error
//             }
//             resolve(result); // Resolve the promise with the result
//         });
//     });
// };

const getRemindersByDateandByAssignmentId = (assignment_id) => {
    return new Promise((resolve, reject) => {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const query = `
            SELECT reminder_id, DATE_FORMAT(reminder_date, '%Y-%m-%d') AS reminder_date, 
                   reminder_text, created_by, created_date 
            FROM initiate_training_reminders 
            WHERE reminder_date >= ? and assignment_id=?
        `;
        db.query(query, [currentDate,assignment_id], (err, rows) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return reject(err); // Reject the promise with the error
            }
            resolve(rows); // Resolve the promise with the rows
        });
    });
};
const getRemindersByDateandByEmpId = (emp_id) => {
    return new Promise((resolve, reject) => {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const query = `
        SELECT 
            itr.reminder_id, 
            DATE_FORMAT(itr.reminder_date, '%Y-%m-%d') AS reminder_date, 
            itr.reminder_text, 
            itr.created_by, 
            itr.created_date, 
            itr.assignment_id,
            ac.course_id,
            c.course_name,
            ac.employee_id,
            ac.requestid,
            e.emp_name
        FROM initiate_training_reminders itr
        JOIN assigned_courses ac ON itr.assignment_id = ac.assignment_id
        JOIN course c ON ac.course_id = c.course_id
        JOIN employee e ON ac.employee_id = e.emp_id
        WHERE itr.reminder_date >= ? AND itr.created_by = ?
    `;
        db.query(query, [currentDate,emp_id], (err, rows) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return reject(err); // Reject the promise with the error
            }
            resolve(rows); // Resolve the promise with the rows
        });
    });
};
module.exports = {
    createReminder,
    deleteReminder,
    // updateReminder,
    getRemindersByDateandByAssignmentId,
    getRemindersByDateandByEmpId
};