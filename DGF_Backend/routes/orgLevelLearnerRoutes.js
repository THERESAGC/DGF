const express = require('express');
const { getOrgLevelLearnerDataController } = require('../controllers/orgLevelLearnerController');

const router = express.Router();

router.get('/getOrgLevelLearnerData/:emp_id', getOrgLevelLearnerDataController);

module.exports = router;