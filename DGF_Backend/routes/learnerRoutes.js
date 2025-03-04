const express = require('express');
const { getLearnersController } = require('../controllers/learnerController');

const router = express.Router();

router.get('/getLearners/:emp_id', getLearnersController);

module.exports = router;