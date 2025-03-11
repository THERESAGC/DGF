const express = require('express');
const router = express.Router();
const { getAllRoles } = require('../controllers/getAllRolesController');

// Define the route to get all roles
router.get('/getAllRoles', getAllRoles);

module.exports = router;