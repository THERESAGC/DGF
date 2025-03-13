const express = require('express');
const { updateUserRoleController } = require('../controllers/updateUserRoleController');

const router = express.Router();

router.put('/update-role', updateUserRoleController);

module.exports = router;