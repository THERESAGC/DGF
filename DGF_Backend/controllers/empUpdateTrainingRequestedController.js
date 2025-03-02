const { updateMultipleEmpNewTrainingRequested } = require('../services/empUpdateTrainingRequestedService');

// Controller to handle updating multiple training request details
const updateMultipleTrainingRequests = async (req, res) => {
    const employees = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
        return res.status(400).json({ error: 'An array of employee objects is required' });
    }

    try {
        const result = await updateMultipleEmpNewTrainingRequested(employees);
        res.status(200).json({ message: 'Training requests updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the training requests', details: error.message });
    }
};

module.exports = {
    updateMultipleTrainingRequests,
};