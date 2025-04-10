const { getLearnersService } = require('../services/learnerService');

const getLearnersController = async (req, res) => {
    const { emp_id } = req.params;
    try {
        const learners = await getLearnersService(emp_id);
        res.status(200).json(learners);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the learners', details: error.message });
    }
};

module.exports = {
    getLearnersController
};