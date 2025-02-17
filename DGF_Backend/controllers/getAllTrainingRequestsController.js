const getAllTrainingRequestsService = require('../services/getAllTrainingRequestsService');

exports.getAllTrainingRequests = async (req, res) => {
    try {
        // Get all training requests from the service
        const trainingRequests = await getAllTrainingRequestsService.getAllTrainingRequests();

        // Return the data as a JSON response
        res.status(200).json({
            message: 'Training requests fetched successfully',
            data: trainingRequests
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
