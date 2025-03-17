const { searchProjectsByName } = require('../services/projectSearchService');

const searchProjects = async (req, res) => {
    const { letter } = req.query;

    if (!letter) {
        return res.status(400).json({ error: 'Search letter is required' });
    }

    try {
        const results = await searchProjectsByName(letter);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ 
            error: 'An error occurred while searching projects',
            details: error.message
        });
    }
};

module.exports = {
    searchProjects
};