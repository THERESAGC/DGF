// controllers/employeeController.js
const employeeService = require('../services/employeeSearchByNameService');

exports.searchEmployees = async (req, res) => {
    const { name } = req.query;

    // Check if name parameter is provided
    if (!name) {
        return res.status(400).json({ message: 'name query parameter is required' });
    }

    try {
        // Fetch employees matching the name
        const employees = await employeeService.searchEmployeesByName(name);
        if (employees.length === 0) {
            return res.status(404).json({ message: 'No employees found matching the search term.' });
        }
        res.status(200).json(employees);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

