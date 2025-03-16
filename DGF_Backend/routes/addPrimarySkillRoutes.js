// addPrimarySkillRoutes.js
const express = require('express');
const { addPrimarySkill } = require('../controllers/addPrimarySkillController');

const router = express.Router();

router.post('/primary-skill', addPrimarySkill);

module.exports = router;