// controllers/trainingRequestEmployeeLevelController.js
const trainingRequestEmployeeLevelService = require('../services/trainingRequestEmployeeLevelService');

exports.storeEmployeeLevels = async (req, res) => {
    const { requestid, employee_level_ids } = req.body; // Assume the body contains an array of employee_level_ids for a given requestid.

    if (!requestid || !Array.isArray(employee_level_ids) || employee_level_ids.length === 0) {
        return res.status(400).json({ message: 'Invalid request data' });
    }
    try {
        // Call the service function to store the data
        await trainingRequestEmployeeLevelService.storeEmployeeLevels(requestid, employee_level_ids);
        res.status(200).json({ message: 'Employee levels stored successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
