// routes/assignCourseRoutes.js
const express = require('express');
const router = express.Router();
const { createAssignment } = require('../controllers/assignCourseController');

router.post('/assign', createAssignment);

module.exports = router;