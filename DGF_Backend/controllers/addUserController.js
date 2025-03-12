const { addUser } = require('../services/addUserService');

const addUserController = async (req, res) => {
    const { emp_id, name, email, password, role_id, profile_image, created_on, status } = req.body;

    if (!emp_id || !name || !email || !password || !role_id) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        await addUser({ emp_id, name, email, password, role_id, profile_image, created_on, status });
        res.status(201).json({ message: 'User added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while adding the user', details: error.message });
    }
};

module.exports = {
    addUserController
};