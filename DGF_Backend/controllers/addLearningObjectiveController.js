const { addLearningObjective } = require('../services/addLearningObjectiveService');

// Controller to handle adding a new learning objective
const addLearningObjectiveController = async (req, res) => {
    const { training_name, source_id } = req.body;

    if (!training_name) {
        return res.status(400).json({ error: 'Training name is required' });
    }

    try {
        const result = await addLearningObjective(training_name, source_id || null);
        res.status(201).json({
            message: 'Learning objective added successfully',
            data: { training_id: result.insertId, training_name, source_id },
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add learning objective', details: error.message });
    }
};

module.exports = {
    addLearningObjectiveController,
};