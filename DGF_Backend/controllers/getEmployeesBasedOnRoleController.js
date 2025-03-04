const { getEmployeesBasedOnRole } = require('../services/getEmployeesBasedOnRoleService');

// Controller to handle getting data from emp_newtrainingrequested based on requestid
const getEmpsforCapdev = async (req, res) => {
    
    try {
        const data = await getEmployeesBasedOnRole();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving data', details: error.message });
    }
};

module.exports = {
    getEmpsforCapdev
};