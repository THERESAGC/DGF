const { getOrgLevelLearnerDataService } = require('../services/orgLevelLearnerService');

const getOrgLevelLearnerDataController = async (req, res) => {
    try {
        const learners = await getOrgLevelLearnerDataService();
        res.status(200).json(learners);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving the learners', details: error.message });
    }
};

module.exports = {
    getOrgLevelLearnerDataController
};