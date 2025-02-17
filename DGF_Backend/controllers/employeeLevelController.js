// controllers/employeeLevelController.js
const employeeLevelService = require('../services/employeeLevelService');

exports.getAllJobTitles = async (req, res) => {
    try {
        const jobTitles = await employeeLevelService.getAllJobTitles();
        if (jobTitles.length === 0) {
            return res.status(404).json({ message: 'No job titles found.' });
        }
        res.status(200).json(jobTitles);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
