const sourceService = require('../services/sourceService');

// Controller to handle the API request for retrieving all sources
const getAllSources = async (req, res) => {
    try {
        const sources = await sourceService.getAllSources();
        res.status(200).json(sources);
    } catch (error) {
        res.status(500).json({ error: 'Failed to retrieve sources', details: error.message });
    }
};

module.exports = {
    getAllSources
};