const express = require('express');
const router = express.Router();
const projectController = require('../controllers/deleteProjectController');

router.delete('/projects/:id', projectController.deleteProject);

module.exports = router;