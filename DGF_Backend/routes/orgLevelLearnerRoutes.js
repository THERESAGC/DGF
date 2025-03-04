const express = require('express');
const { getOrgLevelLearnerDataController } = require('../controllers/orgLevelLearnerController');

const router = express.Router();

router.get('/orgLevelLearnerData', getOrgLevelLearnerDataController);

module.exports = router;