// controllers/employeeSearchByEmailController.js
const employeeSearchByEmailService = require('../services/employeeSearchByEmailService');

exports.searchEmployeesByEmail = async (req, res) => {
    const { email } = req.query;

    // Check if email parameter is provided
    if (!email) {
        return res.status(400).json({ message: 'email query parameter is required' });
    }

    try {
        // Fetch employees matching the email
        const employees = await employeeSearchByEmailService.searchEmployeesByEmail(email);
        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found matching the email.' });
        }
        res.status(200).json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
