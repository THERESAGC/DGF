const express = require('express');
const { deletePrimarySkillController } = require('../controllers/deletePrimarySkillController');

const router = express.Router();

/**
 * DELETE /api/primary-skill/:skillId
 * Deletes a primary skill by ID.
 */
router.delete('/primary-skill/:skillId', deletePrimarySkillController);

module.exports = router;