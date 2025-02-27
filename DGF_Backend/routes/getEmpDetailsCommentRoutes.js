const express = require('express');
const router = express.Router();
const { getEmpbasedOnIdController } = require('../controllers/getEmpDetailsCommentController');

router.get('/getEmpbasedOnId/:empid', getEmpbasedOnIdController);

module.exports = router;