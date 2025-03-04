const db = require('../config/db');

// Fetch comments by request ID
const getEmployeeById = (empid) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT name FROM logintable WHERE emp_id = ?';
    db.query(query, [empid], (err, results) => {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });
};

const setAssignedTobyId = async (requestid, emp_id) => {
  return new Promise((resolve, reject) => {
    const query = `UPDATE newtrainingrequest SET AssignedTo = ? WHERE requestid = ?`;
                 
    
    db.execute(query, [emp_id,requestid], (err, result) => {
      if (err) {
        console.error("Error inserting comment:", err); // Log detailed error
        reject(err);
      } else {
        resolve(result);      
      }
    });
  });
};

module.exports = {
    setAssignedTobyId,
    getEmployeeById,
};