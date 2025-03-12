const { updateUserStatus } = require('../services/userUpdateStatusService');

const updateUserStatusController = async (req, res) => {
    const { userId, status } = req.body;

    if (!userId || !status) {
        return res.status(400).json({ message: 'userId and status are required' });
    }

    try {
        await updateUserStatus(userId, status);
        res.status(200).json({ message: 'User status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};

module.exports = {
    updateUserStatusController,
};