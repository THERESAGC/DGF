const express = require('express');
const router = express.Router();
const { searchManagers } = require('../controllers/managerSearchByNameController');

router.get('/searchManagersByName', searchManagers);

module.exports = router;