const { deleteLearningObjectiveService } = require('../services/deleteLearningObjectiveService');

// Controller to handle deleting a learning objective
const deleteLearningObjectiveController = async (req, res) => {
    const { trainingId } = req.params;

    if (!trainingId) {
        return res.status(400).json({ error: 'Training ID is required' });
    }

    try {
        await deleteLearningObjectiveService(trainingId);
        res.status(200).json({ message: 'Learning objective deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete learning objective', details: error.message });
    }
};

module.exports = {
    deleteLearningObjectiveController,
};