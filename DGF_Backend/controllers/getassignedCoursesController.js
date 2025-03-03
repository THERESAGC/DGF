// controllers/getassignedCoursesController.js
const { getAssignedCoursesByEmployeeAndRequest } = require('../services/getassignedCoursesService');

const getAssignedCourses = async (req, res) => {
    const { emp_id, request_id } = req.params;

    // Validate input parameters
    if (!emp_id || !request_id) {
        return res.status(400).json({ message: 'emp_id and request_id are required parameters' });
    }

    try {
        const assignedCourses = await getAssignedCoursesByEmployeeAndRequest(emp_id, request_id);
        res.status(200).json({ data: assignedCourses });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

module.exports = {
    getAssignedCourses,
};
