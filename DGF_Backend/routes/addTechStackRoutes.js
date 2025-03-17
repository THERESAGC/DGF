const express = require('express');
const techStackController = require('../controllers/addTechStackController');

const router = express.Router();

router.post('/tech-stacks', techStackController.addTechStack);

module.exports = router;