const { insertMultipleEmpNewTrainingRequested } = require('../services/empNewTrainingRequestedService');

// Controller to handle inserting a new training request
const insertTrainingRequest = async (req, res) => {
    const employees = req.body;

    if (!Array.isArray(employees) || employees.length === 0) {
        return res.status(400).json({ error: 'An array of employee objects is required' });
    }

    try {
        await insertMultipleEmpNewTrainingRequested(employees);
        res.status(200).json({ message: 'Training requests inserted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while inserting the training requests', details: error.message });
    }
};

module.exports = {
    insertTrainingRequest
};