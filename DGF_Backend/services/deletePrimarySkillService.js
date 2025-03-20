const db = require('../config/db');

/**
 * Deletes a primary skill by its ID.
 * @param {number} skillId - The ID of the skill to delete.
 * @returns {Promise<void>}
 */
async function deletePrimarySkill(skillId) {
    const query = 'DELETE FROM primaryskill WHERE skill_id = ?';
    try {
        await db.execute(query, [skillId]);
    } catch (error) {
        console.error('Error deleting primary skill:', error);
        throw new Error('Failed to delete primary skill');
    }
}

module.exports = { deletePrimarySkill };