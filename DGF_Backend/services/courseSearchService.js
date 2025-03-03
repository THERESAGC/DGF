// services/courseSearchService.js
const db = require('../config/db');

const searchCoursesByName = (searchQuery) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT course_id, course_name, course_description, duration_hours, created_date
            FROM course
            WHERE course_name LIKE ?
            ORDER BY course_name;
        `;
        
        db.execute(query, [`${searchQuery}%`], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    searchCoursesByName
};