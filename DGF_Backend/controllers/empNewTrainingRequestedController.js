const { insertEmpNewTrainingRequested, deleteEmployeeFromTrainingRequest } = require('../services/empNewTrainingRequestedService');

// Controller to handle inserting a new training request
const insertTrainingRequest = async (req, res) => {
    const { emp_id, availablefrom, dailyband, availableonweekend, requestid } = req.body;

    if (!emp_id || !availablefrom || !dailyband || !availableonweekend || !requestid) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        await insertEmpNewTrainingRequested(emp_id, availablefrom, dailyband, availableonweekend, requestid);
        res.status(200).json({ message: 'Training request inserted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while inserting the training request', details: error.message });
    }
};

// Controller to handle deleting an employee from a training request
const removeEmployeeFromTrainingRequest = async (req, res) => {
    const { empId, requestId } = req.body;

    if (!empId || !requestId) {
        return res.status(400).json({ error: 'Employee ID and request ID are required' });
    }

    try {
        await deleteEmployeeFromTrainingRequest(empId, requestId);
        res.status(200).json({ message: 'Employee removed from training request' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while removing the employee', details: error.message });
    }
};

module.exports = {
    insertTrainingRequest,
    removeEmployeeFromTrainingRequest,
};