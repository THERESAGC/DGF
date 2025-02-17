// controllers/techstackController.js
const techstackService = require('../services/techstackService');

exports.getAllTechStacks = async (req, res) => {
    try {
        const techStacks = await techstackService.getAllTechStacks();
        if (techStacks.length === 0) {
            return res.status(404).json({ message: 'No tech stacks found.' });
        }
        res.status(200).json(techStacks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
