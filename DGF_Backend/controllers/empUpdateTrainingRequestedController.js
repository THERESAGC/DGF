const { updateEmpNewTrainingRequested } = require('../services/empUpdateTrainingRequestedService');

// Controller to handle updating training request details
const updateTrainingRequest = async (req, res) => {
    const { emp_id, requestid, availablefrom, dailyband, availableonweekend } = req.body;

    if (!emp_id || !requestid || !availablefrom || !dailyband || availableonweekend === undefined) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const result = await updateEmpNewTrainingRequested(emp_id, requestid, availablefrom, dailyband, availableonweekend);
        res.status(200).json({ message: 'Training request updated successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the training request', details: error.message });
    }
};

module.exports = {
    updateTrainingRequest,
};