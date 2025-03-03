// controllers/courseTypeController.js
const { getAllCourseTypes } = require('../services/courseTypeService');

const getCourseTypes = async (req, res) => {
    try {
        const courseTypes = await getAllCourseTypes();
        res.status(200).json(courseTypes);
    } catch (error) {
        res.status(500).json({ 
            error: 'An error occurred while fetching course types',
            details: error.message
        });
    }
};

module.exports = {
    getCourseTypes
};