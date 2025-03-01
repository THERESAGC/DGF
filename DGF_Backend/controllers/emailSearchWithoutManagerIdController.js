const { getEmployeesByPartialEmail } = require('../services/emailSearchWithoutManagerIdService');

// Controller to handle getting employees by partial email
const getEmployeesByPartialEmailController = async (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    try {
        const employees = await getEmployeesByPartialEmail(email);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the employees', details: error.message });
    }
};

module.exports = {
    getEmployeesByPartialEmailController
};