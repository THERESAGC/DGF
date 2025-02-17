// controllers/projectController.js
const projectService = require('../services/projectService');

exports.getAllProjects = async (req, res) => {
    try {
        const projects = await projectService.getAllProjects();
        if (projects.length === 0) {
            return res.status(404).json({ message: 'No projects found.' });
        }
        res.status(200).json(projects);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
