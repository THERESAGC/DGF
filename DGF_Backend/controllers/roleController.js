//controllers/roleController.js

const roleService = require('../services/roleService');

exports.getSourcesByRole = async (req, res) => {
    const { role_id } = req.query;

    // Check if role_id is provided in the query parameters
    if (!role_id) {
        return res.status(400).json({ message: 'role_id is required' });
    }

    try {
        const sources = await roleService.getSourcesByRole(role_id);
        if (sources.length === 0) {
            return res.status(404).json({ message: 'No sources found for this role.' });
        }
        res.status(200).json(sources);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
