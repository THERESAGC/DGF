//getEmpLearningCompletionController.js

const employeeService = require('../services/getEmpLearningCompletionService');
 
const getEmployeeCompletionStatus = async (req, res) => {
  const { requestId } = req.params;
  try {
    const result = await employeeService.getEmployeeCompletionStatus(requestId);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching employee completion status', error });
  }
};
 
module.exports = { getEmployeeCompletionStatus };