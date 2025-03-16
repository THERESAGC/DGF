const techStackService = require('../services/deleteTechStackService');
 
const deleteTechStack = async (req, res) => {
  try {
    const stackId = parseInt(req.params.stackId);
    if (isNaN(stackId)) {
      return res.status(400).json({ message: 'Invalid tech stack ID' });
    }
 
    await techStackService.deleteTechStackAndSkills(stackId);
    res.status(200).json({
      message: 'Tech stack and associated primary skills deleted successfully'
    });
    
  } catch (error) {
    console.error('Error deleting tech stack:', error);
    res.status(500).json({
      message: error.message || 'Internal server error'
    });
  }
};
 
module.exports = {
  deleteTechStack
};