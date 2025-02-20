const { getAllTrainingRequests } = require('../services/getAllTrainingRequestsService');

const getAllRequests = async (req, res) => {
    try {
        const results = await getAllTrainingRequests();
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving training requests', details: error.message });
    }
};

module.exports = {
    getAllRequests
};