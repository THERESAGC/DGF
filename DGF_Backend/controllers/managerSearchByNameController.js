const { searchManagersByName } = require('../services/managerSearchByNameservice');

const searchManagers = async (req, res) => {
    const { name } = req.query;

    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }

    try {
        const results = await searchManagersByName(name);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while searching for managers', details: error.message });
    }
};

module.exports = {
    searchManagers
};