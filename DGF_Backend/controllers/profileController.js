const profileService = require('../services/profileService');

// Controller to get employee details by ID
const getEmployeeDetails = async (req, res) => {
    try {
        const employeeDetails = await profileService.getEmployeeDetailsById(req.params.id);
        res.status(200).json(employeeDetails);
    } catch (error) {
        console.error('Error fetching employee details', error);
        res.status(500).json({ message: 'Error fetching employee details' });
    }
};

module.exports = {
    getEmployeeDetails
};