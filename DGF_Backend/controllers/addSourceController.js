const { addSource } = require('../services/addSourceService');

// Controller to handle adding a new source
const addSourceController = async (req, res) => {
    const { source_name } = req.body;

    if (!source_name) {
        return res.status(400).json({ error: 'Source name is required' });
    }

    try {
        const result = await addSource(source_name);
        res.status(201).json({ message: 'Source added successfully', data: result });
    } catch (error) {
        res.status(500).json({ error: 'Failed to add source', details: error.message });
    }
};

module.exports = {
    addSourceController
};