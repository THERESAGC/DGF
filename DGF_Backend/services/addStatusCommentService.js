const db = require('../config/db');

const addStatusComment = async (assignmentId, comments) => {
    const query = `
        INSERT INTO status_comments (assignment_id, comments)
        VALUES (?, ?)
    `;
    const [result] = await db.promise().execute(query, [assignmentId, comments]);
    return result;
};

module.exports = {
    addStatusComment
};