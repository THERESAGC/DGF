// projectController.js
const projectService = require('../services/projectService');

exports.getProjectsByServiceDivision = async (req, res) => {
    const { service_division_id } = req.query;

    if (!service_division_id) {
        return res.status(400).json({ message: 'service_division_id is required' });
    }

    try {
        const projects = await projectService.getProjectsByServiceDivision(service_division_id);
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found for this service division' });
        }
        res.status(200).json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};