const express = require('express');
const commentController = require('../controllers/commentController');

const router = express.Router();

// Route to get comments for a specific request
router.get('/:requestid', commentController.getComments);

// Route to add a new comment
router.post('/', commentController.addComment);

module.exports = router;
