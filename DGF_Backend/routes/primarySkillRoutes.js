// routes/primarySkillRoutes.js
const express = require('express');
const router = express.Router();
const primarySkillController = require('../controllers/primarySkillController');

// Route to fetch primary skills by tech stack ID
router.get('/by-stack', primarySkillController.getPrimarySkillsByTechStack);

module.exports = router;
