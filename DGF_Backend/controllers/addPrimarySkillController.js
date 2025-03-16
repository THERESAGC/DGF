// addPrimarySkillController.js
const primarySkillService = require('../services/addPrimarySkillService');

const addPrimarySkill = async (req, res) => {
  try {
    const { skillName, stackId } = req.body;

    // Validate that both fields are provided
    if (!skillName || !stackId) {
      return res.status(400).json({ message: 'Skill name and stack ID are required' });
    }

    // Call the service to add the primary skill
    const skillId = await primarySkillService.addPrimarySkill(skillName, stackId);

    // Respond with the created skill ID and the associated stack ID
    res.status(201).json({
      skillId,
      skillName,
      stackId,
    });
  } catch (error) {
    console.error('Error adding primary skill:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addPrimarySkill,
};
