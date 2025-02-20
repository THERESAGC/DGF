const requestStatusService = require('../services/requestStatusService');

exports.updateRequestStatus = async (req, res) => {
    const { requestId, status, roleId, approverId } = req.body;

    if (!requestId || !status || !roleId || !approverId) {
        return res.status(400).json({ message: 'requestId, status, roleId, and approverId are required' });
    }

    try {
        await requestStatusService.updateRequestStatus(requestId, status, roleId, approverId);
        res.status(200).json({ message: 'Request status updated successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error', error: err.message });
    }
};