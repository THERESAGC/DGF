const { updateUserRole } = require('../services/updateUserRoleService');

const updateUserRoleController = async (req, res) => {
    const { emp_id, role_name } = req.body;

    try {
        const result = await updateUserRole(emp_id, role_name);
        res.status(200).json({ message: 'Role updated successfully', result });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    updateUserRoleController
};