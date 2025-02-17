// controllers/primarySkillController.js
const primarySkillService = require('../services/primarySkillService');

exports.getPrimarySkillsByTechStack = async (req, res) => {
    const { stack_id } = req.query;

    // Validate if stack_id is provided
    if (!stack_id) {
        return res.status(400).json({ message: 'stack_id is required' });
    }

    try {
        const skills = await primarySkillService.getPrimarySkillsByStack(stack_id);
        if (skills.length === 0) {
            return res.status(404).json({ message: 'No primary skills found for this tech stack.' });
        }
        res.status(200).json(skills);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
