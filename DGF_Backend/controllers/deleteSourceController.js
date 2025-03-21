const { deleteSourceService } = require('../services/deleteSourceService');

const deleteSourceController = async (req, res) => {
    const { sourceId } = req.params;

    if (!sourceId) {
        return res.status(400).json({ error: 'Source ID is required' });
    }

    try {
        await deleteSourceService(sourceId);
        res.status(200).json({ message: 'Source deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete source', details: error.message });
    }
};

module.exports = {
    deleteSourceController,
};