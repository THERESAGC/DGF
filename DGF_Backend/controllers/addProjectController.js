const { addProject } = require('../services/addProjectService');

const addProjectController = async (req, res) => {
    const { ProjectName } = req.body;

    try {
        const result = await addProject(ProjectName);
        res.status(201).json({ message: 'Project added successfully', data: result });
    } catch (error) {
        res.status(500).json({ message: 'Error adding project', error: error.message });
    }
};

module.exports = {
    addProjectController
};