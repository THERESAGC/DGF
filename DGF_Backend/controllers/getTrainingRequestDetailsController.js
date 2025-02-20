const { getTrainingRequestDetails } = require('../services/getTrainingRequestDetailsService');

const getTrainingRequestDetailsById = async (req, res) => {
    const { requestid } = req.params;

    if (!requestid) {
        return res.status(400).json({ error: 'Request ID is required' });
    }

    try {
        const requestDetails = await getTrainingRequestDetails(requestid);

        if (!requestDetails) {
            return res.status(404).json({ error: 'Training request not found' });
        }

        res.status(200).json(requestDetails);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the training request details', details: error.message });
    }
};

module.exports = {
    getTrainingRequestDetailsById
};