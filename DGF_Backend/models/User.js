const db = require('../config/db');

// User Model to interact with the "logintable"
const User = {
    findByEmail: (email, callback) => {
        const query = 'SELECT * FROM logintable WHERE email = ?';
        db.execute(query, [email], (err, result) => {
            callback(err, result);
        });
    }
};

module.exports = User;
