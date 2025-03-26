
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

const updateReminder = (reminder_id, updatedFields) => {
    return new Promise((resolve, reject) => {
        const query = `
            UPDATE initiate_training_reminders
            SET reminder_date = ?, reminder_text = ?
            WHERE reminder_id = ?
        `;
        const values = [updatedFields.reminder_date, updatedFields.reminder_text, reminder_id];
        db.query(query, values, (err, result) => {
            if (err) {
                console.error('Error executing query:', err.message);
                return reject(err); // Reject the promise with the error
            }
            resolve(result); // Resolve the promise with the result
        });
    });
};

const getRemindersByDate = () => {
    return new Promise((resolve, reject) => {
        const currentDate = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
        const query = `
            SELECT reminder_id, assignment_id, DATE_FORMAT(reminder_date, '%Y-%m-%d') AS reminder_date, 
                   reminder_text, created_by, created_date 
            FROM initiate_training_reminders 
            WHERE reminder_date >= ?
        `;
        db.query(query, [currentDate], (err, rows) => {
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
    updateReminder,
    getRemindersByDate,
};