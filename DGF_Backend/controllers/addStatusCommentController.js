const { addStatusComment } = require('../services/addStatusCommentService');

const addStatusCommentController = async (req, res) => {
    try {
        console.log('Request body:', req.body);

        const { assignmentId, comments } = req.body;

        if (!assignmentId || !comments) {
            return res.status(400).json({ error: 'assignmentId and comments are required' });
        }

        const result = await addStatusComment(assignmentId, comments);
        res.status(201).json({ message: 'Comment added successfully', commentId: result.insertId });
    } catch (error) {
        console.error('Error in addStatusCommentController:', error);
        res.status(500).json({ 
            error: 'An error occurred while adding the comment', 
            details: error.message 
        });
    }
};

module.exports = {
    addStatusCommentController
};