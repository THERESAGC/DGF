const db = require('../config/db');

// Fetch comments by request ID
const getCommentsByRequestId = (requestid) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM comments WHERE requestid = ? ORDER BY created_date';
    db.query(query, [requestid], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const addComments = async (requestid, comment_text, created_by, parent_comment_id, requeststatus) => {
  return new Promise((resolve, reject) => {
    const query = `INSERT INTO comments (requestid, comment_text, created_by, parent_comment_id)
                   VALUES (?, ?, ?, ?)`;
    console.log(requeststatus, "requestStatus");
    const values = [
      requestid,
      comment_text,
      created_by,
      parent_comment_id || null,
    ];

    db.execute(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting comment:", err); // Log detailed error
        reject(err);
      } else {
        console.log("In else", requeststatus);

        if (requeststatus === 'Approval Requested') {
          const updateStatusQuery = `UPDATE newtrainingrequest SET requeststatus = 'Approval Requested' WHERE requestid = ?`;

          db.execute(updateStatusQuery, [requestid], (err, updateResult) => {
            if (err) {
              console.error("Error updating status:", err); // Log detailed error
              reject(err);
            } else {
              console.log("Status updated successfully");
              resolve(result.insertId);
            }
          });
        } else {
          resolve(result.insertId);
        }
      }
    });
  });
};

module.exports = {
  getCommentsByRequestId,
  addComments,
};