const db = require('../config/db');

// Function to delete a learning objective
const deleteLearningObjectiveService = async (trainingId) => {
    const query = 'DELETE FROM training_obj WHERE training_id = ?';
    await db.execute(query, [trainingId]);
};

module.exports = {
    deleteLearningObjectiveService,
};