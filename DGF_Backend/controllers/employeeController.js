const { getEmployeesByDesignation } = require('../services/employeeDesignationService');

const getEmployeesByDesignationController = async (req, res) => {
    const { designationIds } = req.query;

    if (!designationIds) {
        return res.status(400).json({ error: 'Designation IDs are required' });
    }

    try {
        const idsArray = designationIds.split(',').map(id => parseInt(id, 10));
        console.log('Received designation IDs:', idsArray);
        const employees = await getEmployeesByDesignation(idsArray);
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error retrieving employees:', error);
        res.status(500).json({ error: 'An error occurred while retrieving employees', details: error.message });
    }
};

module.exports = {
    getEmployeesByDesignationController
};