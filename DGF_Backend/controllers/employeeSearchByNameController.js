const { searchEmployeesByName } = require('../services/employeeSearchByNameService');

const searchEmployees = async (req, res) => {
    const { managerId, name } = req.query;

    if (!managerId || !name) {
        return res.status(400).json({ error: 'Manager ID and name are required' });
    }

    try {
        const results = await searchEmployeesByName(managerId, name);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for employees', details: error.message });
    }
};

module.exports = {
    searchEmployees
};