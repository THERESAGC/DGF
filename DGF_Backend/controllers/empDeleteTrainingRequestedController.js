const { deleteEmployeeFromTrainingRequest } = require('../services/empDeleteTrainingRequestedService');

const deleteEmployee = async (req, res) => {
    const { empId, requestId } = req.body;
    if (!empId || !requestId) {
        return res.status(400).json({ error: 'Employee ID and Request ID are required' });
    }

    try {
        const result = await deleteEmployeeFromTrainingRequest(empId, requestId);
        res.status(200).json({ message: 'Employee deleted from training request successfully', result });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting employee from training request', error });
    }
};

module.exports = {
    deleteEmployee,
};