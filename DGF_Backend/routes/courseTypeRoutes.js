// routes/courseTypeRoutes.js
const express = require('express');
const router = express.Router();
const { getCourseTypes } = require('../controllers/courseTypeController');

router.get('/types', getCourseTypes);

module.exports = router;