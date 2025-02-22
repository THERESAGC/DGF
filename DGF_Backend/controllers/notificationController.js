const { getNotifications, markNotificationAsRead } = require('../services/notificationService');

const showNotifications = async (req, res) => {
    const { empId, roleId } = req.query;

    if (!empId || !roleId) {
        return res.status(400).json({ error: 'Employee ID and role ID are required' });
    }

    try {
        const notifications = await getNotifications(empId, parseInt(roleId));
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving notifications', details: error.message });
    }
};

const markAsRead = async (req, res) => {
    const { notificationId } = req.body;

    if (!notificationId) {
        return res.status(400).json({ error: 'Notification ID is required' });
    }

    try {
        await markNotificationAsRead(notificationId);
        res.status(200).json({ message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while marking the notification as read', details: error.message });
    }
};

module.exports = {
    showNotifications,
    markAsRead
};