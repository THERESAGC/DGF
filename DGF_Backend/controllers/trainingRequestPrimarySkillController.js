const trainingRequestPrimarySkillService = require('../services/trainingRequestPrimarySkillService');

const storePrimarySkills = async (req, res) => {
    const { requestid, primary_skill_ids } = req.body;

    if (!requestid || !Array.isArray(primary_skill_ids)) {
        return res.status(400).json({ error: 'Invalid input' });
    }

    try {
        const result = await trainingRequestPrimarySkillService.storePrimarySkills(requestid, primary_skill_ids);
        res.status(200).json({ message: 'Primary skills stored successfully', result });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while storing primary skills', details: error.message });
    }
};

module.exports = {
    storePrimarySkills
};