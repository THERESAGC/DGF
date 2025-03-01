const { getEmpNewTrainingRequestedByRequestId } = require('../services/getEmpNewTrainingRequestedService');

// Controller to handle getting data from emp_newtrainingrequested based on requestid
const getEmpNewTrainingRequested = async (req, res) => {
    const { requestid } = req.query;

    if (!requestid) {
        return res.status(400).json({ error: 'Request ID is required' });
    }

    try {
        const data = await getEmpNewTrainingRequestedByRequestId(requestid);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving data', details: error.message });
    }
};

module.exports = {
    getEmpNewTrainingRequested
};