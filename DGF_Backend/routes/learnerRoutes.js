const express = require('express');
const { getLearnersController } = require('../controllers/learnerController');

const router = express.Router();

router.get('/getLearners', getLearnersController);

module.exports = router;