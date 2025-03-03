// controllers/courseSearchController.js
const { searchCoursesByName } = require('../services/courseSearchService');

const searchCourses = async (req, res) => {
    const { query } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Search query is required' });
    }

    try {
        const results = await searchCoursesByName(query);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ 
            error: 'An error occurred while searching courses',
            details: error.message
        });
    }
};

module.exports = {
    searchCourses
};