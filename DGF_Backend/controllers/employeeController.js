const { getEmployeesByDesignation } = require('../services/employeeDesignationService');
 
const getEmployeesByDesignationController = async (req, res) => {
    const { designationNames } = req.query;
 
    if (!designationNames) {
        return res.status(400).json({ error: 'Designation names are required' });
    }
 
    try {
        const namesArray = designationNames.split(',').map(name => name.trim());
        console.log('Received designation names:', namesArray);
        const employees = await getEmployeesByDesignation(namesArray);
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error retrieving employees:', error);
        res.status(500).json({ error: 'An error occurred while retrieving employees', details: error.message });
    }
};
 
module.exports = {
    getEmployeesByDesignationController
};
 