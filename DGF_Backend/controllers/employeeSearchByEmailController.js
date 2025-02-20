const { searchEmployeesByManagerIdAndEmail } = require('../services/employeeSearchByEmailService');

const searchEmployees = async (req, res) => {
    const { managerid, emailPrefix } = req.query;

    if (!managerid || !emailPrefix) {
        return res.status(400).json({ error: 'Manager ID and email prefix are required' });
    }

    try {
        const results = await searchEmployeesByManagerIdAndEmail(managerid, emailPrefix);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving employees', details: error.message });
    }
};

module.exports = {
    searchEmployees
};