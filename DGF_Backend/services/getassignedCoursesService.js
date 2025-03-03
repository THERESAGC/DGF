// services/getassignedCoursesService.js
const db = require('../config/db');

const getAssignedCoursesByEmployeeAndRequest = async (emp_id, request_id) => {
    return new Promise((resolve, reject) => {
        const query = `
            SELECT 
                ac.assignment_id,
                ac.requestid,
                ac.employee_id,
                e1.emp_name AS employee_name,
                ac.mentor_id,
                e2.emp_name AS mentor_name,
                ac.course_id,
                c.course_name,
                ac.coursetype_id,
                ct.type_name AS coursetype_name,
                ac.completion_date,
                ac.comments,
                ac.assigned_date,
                ac.learning_type,
                ac.progress,
                ac.status
            FROM assigned_courses ac
            JOIN employee e1 ON ac.employee_id = e1.emp_id
            JOIN employee e2 ON ac.mentor_id = e2.emp_id
            JOIN course c ON ac.course_id = c.course_id
            JOIN course_type ct ON ac.coursetype_id = ct.type_id
            WHERE ac.employee_id = ? AND ac.requestid = ?;
        `;

        db.execute(query, [emp_id, request_id], (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = {
    getAssignedCoursesByEmployeeAndRequest,
};