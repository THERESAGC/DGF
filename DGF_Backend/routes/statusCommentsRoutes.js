const express = require('express');
const { addStatusCommentController } = require('../controllers/addStatusCommentController');
const { getStatusCommentsController } = require('../controllers/getStatusCommentsController');
 
const router = express.Router();
 
router.post('/status-comments', addStatusCommentController);
// Route to get course details and comments by requestId and employeeId
router.get('/status-comments', getStatusCommentsController);
 
module.exports = router;