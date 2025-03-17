const deleteProjectService = require('../services/deleteProjectService');

const deleteProject = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteProjectService.deleteProjectService(id);
    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting project' });
  }
};

module.exports = {
  deleteProject,
};