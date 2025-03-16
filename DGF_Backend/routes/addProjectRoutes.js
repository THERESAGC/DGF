const express = require('express');
const { addProjectController } = require('../controllers/addProjectController');

const router = express.Router();

router.post('/add-project', addProjectController);

module.exports = router;