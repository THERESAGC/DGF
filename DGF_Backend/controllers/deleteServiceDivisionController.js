const deleteServiceDivisionService = require('../services/deleteServiceDivisionService');

const deleteServiceDivision = async (req, res) => {
  const { id } = req.params;
  try {
    await deleteServiceDivisionService.deleteServiceDivision(id);
    res.status(200).json({ message: 'Service division deleted successfully' });
  } catch (error) {
    console.error('Error deleting project:', error);
    res.status(500).json({ message: 'Error deleting Service division' });
  }
};

module.exports = {
    deleteServiceDivision,
};