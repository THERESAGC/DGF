const { getEmpbasedOnId } = require('../services/getEmpDetailsCommentService');

const getEmpbasedOnIdController = async (req, res) => {
    const { empid } = req.params;
    console.log(empid,"empid");
    if (!empid) {
        return res.status(400).json({ error: 'EMployee ID is required' });
    }

    try {
        const results = await getEmpbasedOnId(empid);
        res.status(200).json(results);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while retrieving data', details: error.message });
    }
};

module.exports = {
    getEmpbasedOnIdController
};