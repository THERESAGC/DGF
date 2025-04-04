const { getStatusCommentsByRequestAndEmployee } = require('../services/getStatusCommentsService');
 
const getStatusCommentsController = async (req, res) => {
    try {
        const { requestId, employeeId } = req.query;
 
        if (!requestId || !employeeId) {
            return res.status(400).json({ error: 'requestId and employeeId are required' });
        }
 
        const data = await getStatusCommentsByRequestAndEmployee(requestId, employeeId);
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({
            error: 'An error occurred while retrieving course details and comments',
            details: error.message
        });
    }
};
 
module.exports = {
    getStatusCommentsController
};