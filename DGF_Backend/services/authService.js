const User = require('../models/User');

// Authenticate User (direct password comparison)
const authenticateUser = (email, password, callback) => {
    User.findByEmail(email, (err, result) => {
        if (err) {
            return callback('Database error', null);
        }

        if (result.length === 0) {
            return callback('User not found', null);
        }

        const user = result[0]; // Assuming email is unique
        if (password !== user.password) {
            return callback('Incorrect password', null);
        }

        return callback(null, user); // Authentication successful
    });
};

module.exports = {
    authenticateUser
};
