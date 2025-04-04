const db = require('../config/db');
 
const getStatusCommentsByRequestAndEmployee = async (requestId, employeeId) => {
    const query = `
        SELECT
            ac.assignment_id,
            ac.requestid,
            ac.employee_id,
            ac.course_id,
            ac.coursetype_id,
            ac.completion_date,
            ac.comments AS course_comments,
            ac.assigned_date,
            ac.learning_type,
            ac.progress,
            ac.status,
            sc.comment_id,
            sc.comments AS status_comments,
            sc.created_date,
            c.course_name
        FROM assigned_courses ac
        LEFT JOIN status_comments sc ON ac.assignment_id = sc.assignment_id
        LEFT JOIN course c ON ac.course_id = c.course_id
        WHERE ac.requestid = ? AND ac.employee_id = ?
    `;
    const [rows] = await db.promise().execute(query, [requestId, employeeId]);
    return rows;
};
 
module.exports = {
    getStatusCommentsByRequestAndEmployee
};
 