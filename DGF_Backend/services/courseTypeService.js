// services/courseTypeService.js
const db = require('../config/db');

const getAllCourseTypes = () => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT type_id, type_name, type_description 
            FROM course_type
            ORDER BY type_name;
        `;
        
        db.execute(query, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getAllCourseTypes
};