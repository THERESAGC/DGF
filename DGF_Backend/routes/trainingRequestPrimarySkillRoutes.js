const express = require('express');
const router = express.Router();
const trainingRequestPrimarySkillController = require('../controllers/trainingRequestPrimarySkillController');

router.post('/storePrimarySkills', trainingRequestPrimarySkillController.storePrimarySkills);

module.exports = router;