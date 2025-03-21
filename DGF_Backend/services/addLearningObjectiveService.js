const db = require('../config/db');

// Function to add a new learning objective
const addLearningObjective = async (training_name, source_id) => {
    const query = 'INSERT INTO training_obj (training_name, source_id) VALUES (?, ?)';
    const [result] = await db.promise().execute(query, [training_name, source_id]);
    return result;
};

module.exports = {
    addLearningObjective,
};