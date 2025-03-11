const roles = require('../services/getAllRolesService');

const getAllRoles = async (req, res) => {
    try {
        const allRoles = await roles.getAllRoles();
        if (allRoles.length === 0) {
            return res.status(404).json({ message: 'No roles found.' });
        }
        res.status(200).json(allRoles);
    } catch (error) {
        console.error('Error fetching roles:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports = {
    getAllRoles
};