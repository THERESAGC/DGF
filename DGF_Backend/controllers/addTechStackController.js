const techStackService = require('../services/addTechStackService');

const addTechStack = async (req, res) => {
  try {
    const { stackName } = req.body;
    if (!stackName) {
      return res.status(400).json({ message: 'Tech stack name is required' });
    }
    const stackId = await techStackService.addTechStack(stackName);
    res.status(201).json({ stackId, stackName });
  } catch (error) {
    console.error('Error adding tech stack:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  addTechStack,
};