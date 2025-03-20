const { addProject } = require('../services/addProjectService');
 
const addProjectController = async (req, res) => {
    const { ProjectName, serviceDivisionId } = req.body; // Extract serviceDivisionId
 
    try {
        // Validate required fields
        if (!ProjectName || !serviceDivisionId) {
            return res.status(400).json({ message: 'Project name and service division ID are required' });
        }
 
        const result = await addProject(ProjectName, serviceDivisionId); // Pass serviceDivisionId
        res.status(201).json({
            message: 'Project added successfully',
            data: {
                ProjectID: result.insertId,
                ProjectName,
                service_division_id: serviceDivisionId
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error adding project', error: error.message });
    }
};
 
module.exports = {
    addProjectController
};