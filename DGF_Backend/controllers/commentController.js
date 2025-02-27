// controllers/commentController.js
const commentService = require('../services/CommentService')

// Controller to get comments for a specific request
const getComments = async (req, res) => {
  try {
    const { requestid } = req.params;
    const comments = await commentService.getCommentsByRequestId(requestid);
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
};

// Controller to add a new comment
const addComment = async (req, res) => {
  try {
    console.log(req.body);
    const { requestid, comment_text, created_by, parent_comment_id,requeststatus } = req.body;
    const newCommentId = await commentService.addComments(requestid, comment_text, created_by, parent_comment_id,requeststatus);
    res.status(201).json({ message: 'Comment added successfully', comment_id: newCommentId });
  } catch (err) {
    res.status(500).json({ error: 'Failed to add comment' });
  }
};

module.exports = {
  getComments,
  addComment,
};
