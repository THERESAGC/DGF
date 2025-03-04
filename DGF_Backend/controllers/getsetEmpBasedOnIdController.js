// controllers/commentController.js
const getsetEmpBasedOnIdService = require('../services/getsetEmpBasedOnIdService');

// Controller to get empname based on empid
const getEmpbyId = async (req, res) => {
  try {
    const { empid } = req.params;
    console.log(empid);
    const name = await getsetEmpBasedOnIdService.getEmployeeById(empid);
    res.json(name);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch emp name' });
  }
};

// Controller to add a new comment
const setAssignedTo = async (req, res) => {
  try {
    console.log(req.body);
    const { requestid, emp_id } = req.body;
    const updatedreqid = await getsetEmpBasedOnIdService.setAssignedTobyId(requestid, emp_id);
    res.status(201).json({ message: 'Assigned to added successfully', updatedreqid: updatedreqid });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add assigned to' });
  }
};

module.exports = {
    getEmpbyId,
  setAssignedTo,
};
