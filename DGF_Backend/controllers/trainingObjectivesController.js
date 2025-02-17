// controllers/trainingController.js
const trainingService = require('../services/trainingObjectivesService'); // Import the service

// Function to get training objectives by source_id
exports.getTrainingObjectivesBySource = async (req, res) => {
    const { source_id } = req.query;

    if (!source_id) {
        return res.status(400).json({ message: 'source_id is required' });
    }

    try {
        // Call the service to get the training objectives based on the source_id
        const trainingObjectives = await trainingService.getTrainingObjectivesBySource(source_id);
        
        if (trainingObjectives.length === 0) {
            return res.status(404).json({ message: 'No training objectives found for this source.' });
        }

        res.status(200).json(trainingObjectives);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
