const db = require('../config/db');
const moment = require('moment');
// Fetch comments by request ID
const getTrainingCommentsByAssignmentId = (assignment_id) => {
  return new Promise((resolve, reject) => {
    console.log(assignment_id,"inside service");
    const query = `SELECT * FROM dgf_dummy.initate_training_comments where assignment_id=? order by created_date desc`;
    db.query(query, [assignment_id], (err, results) => {
      if (err) {
        reject(err);
      } else {
        console.log("Training Comments fetched successfully",results);
        resolve(results);
        
      }
    });
  });
};

const addTrainingComments = async (assignment_id, comment_text, created_by,  created_date) => {
  return new Promise((resolve, reject) => {
    console.log(assignment_id,comment_text, created_by, created_date,"inside service");
    const formattedDate = moment(created_date).format('YYYY-MM-DD HH:mm:ss');
    const query = `INSERT INTO initate_training_comments (assignment_id, comment_text, created_by, created_date)
                   VALUES ( ?, ?, ?,?)`;
  
    const values = [
      assignment_id, 
        comment_text,
        created_by, 
        formattedDate
    ];

    db.execute(query, values, (err, result) => {
      if (err) {
        console.error("Error inserting comment:", err); // Log detailed error
        reject(err);
      } else {
        console.log("Training Comments added successfully");

        resolve(result);
      }
    });
  });
};

module.exports = {
  getTrainingCommentsByAssignmentId,
    addTrainingComments,
};