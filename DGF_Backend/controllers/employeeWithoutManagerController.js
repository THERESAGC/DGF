const { searchEmployeesByNameWithoutManager } = require('../services/employeeSearchWithoutManagerService');

const getEmployeesByNameWithoutManager = async (req, res) => {
    const { name } = req.query;
    try {
        const employees = await searchEmployeesByNameWithoutManager(name);
        res.status(200).json(employees);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getEmployeesByNameWithoutManager
};