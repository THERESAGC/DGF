const { authenticateUser } = require('../services/authService');

// Login Controller
const login = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    authenticateUser(email, password, (err, user) => {
        if (err) {
            return res.status(401).json({ message: err });
        }
        
        // If the password matches, return the user data
        return res.status(200).json({ message: 'Login successful', user });
    });
};

module.exports = {
    login
};
