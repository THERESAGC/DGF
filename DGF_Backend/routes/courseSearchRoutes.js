// routes/courseSearchRoutes.js
const express = require('express');
const router = express.Router();
const { searchCourses } = require('../controllers/courseSearchController');

router.get('/search', searchCourses);

module.exports = router;