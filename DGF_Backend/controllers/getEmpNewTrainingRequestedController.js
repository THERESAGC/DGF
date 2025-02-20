const { getEmpNewTrainingRequestedByRequestId } = require('../services/getEmpNewTrainingRequestedService');

const getEmpNewTrainingRequested = async (req, res) => {
    const { requestid } = req.params;

    if (!requestid) {
        return res.status(400).json({ error: 'Request ID is required' });
    }

    try {
        const results = await getEmpNewTrainingRequestedByRequestId(requestid);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving data', details: error.message });
    }
};

module.exports = {
    getEmpNewTrainingRequested
};