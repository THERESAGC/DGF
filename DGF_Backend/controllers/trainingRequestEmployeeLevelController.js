// controllers/trainingRequestEmployeeLevelController.js
const trainingRequestEmployeeLevelService = require('../services/trainingRequestEmployeeLevelService');
 
exports.storeEmployeeLevels = async (req, res) => {
    const { requestid, designation_names } = req.body; // Assume the body contains an array of designation_names for a given requestid.
 
    if (!requestid || !Array.isArray(designation_names) || designation_names.length === 0) {
        return res.status(400).json({ message: 'Invalid request data' });
    }
    try {
        // Call the service function to store the data
        await trainingRequestEmployeeLevelService.storeEmployeeLevels(requestid, designation_names);
        res.status(200).json({ message: 'Employee levels stored successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};