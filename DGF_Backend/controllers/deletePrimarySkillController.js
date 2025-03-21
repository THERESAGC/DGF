const { deletePrimarySkill } = require('../services/deletePrimarySkillService');

/**
 * Controller to handle deleting a primary skill.
 * @param {import('express').Request} req - The HTTP request object.
 * @param {import('express').Response} res - The HTTP response object.
 */
async function deletePrimarySkillController(req, res) {
    const { skillId } = req.params;

    if (!skillId) {
        return res.status(400).json({ error: 'Skill ID is required' });
    }

    try {
        await deletePrimarySkill(skillId);
        res.status(200).json({ message: 'Primary skill deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { deletePrimarySkillController };