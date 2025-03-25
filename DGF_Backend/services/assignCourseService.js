//service/assignCourseService.js
 
const db = require('../config/db');
 
const assignCourse = (assignmentData) => {
  return new Promise((resolve, reject) => {
    // Get a connection from the pool
    db.getConnection((err, connection) => {
      if (err) return reject(err);
 
      // Begin transaction
      connection.beginTransaction((err) => {
        if (err) {
          connection.release();
          return reject(err);
        }
 
        // Insert into assigned_courses
        const insertQuery = `
          INSERT INTO assigned_courses (
            requestid,
            employee_id,
            mentor_id,
            course_id,
            coursetype_id,
            completion_date,
            comments,
            learning_type,
            course_assigned_by_id
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
        `;
 
        const values = [
          assignmentData.requestid,
          assignmentData.employee_id,
          assignmentData.mentor_id,
          assignmentData.course_id,
          assignmentData.coursetype_id,
          assignmentData.completion_date || null,
          assignmentData.comments || null,
          assignmentData.learning_type || null,
          assignmentData.course_assigned_by_id // Added user ID from session
        ];
        connection.query(insertQuery, values, (err, insertResult) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              return reject(err);
            });
          }
 
          // Increment the number of courses assigned to the employee for this request
          const incrementCourseCountQuery = `
            UPDATE emp_newtrainingrequested
            SET courses_assigned = courses_assigned + 1
            WHERE emp_id = ? AND requestid = ?;
          `;
 
          connection.query(incrementCourseCountQuery,
            [assignmentData.employee_id, assignmentData.requestid],
            (err, incrementResult) => {
              if (err) {
                return connection.rollback(() => {
                  connection.release();
                  return reject(err);
                });
              }
 
              // Update employee status in emp_newtrainingrequested to "Learning Initiated"
              const updateEmpQuery = `
                UPDATE emp_newtrainingrequested
                SET status = 'Learning Initiated'
                WHERE emp_id = ? AND requestid = ?;
              `;
 
              connection.query(updateEmpQuery,
                [assignmentData.employee_id, assignmentData.requestid],
                (err, updateEmpResult) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      return reject(err);
                    });
                  }
 
                  // Update overall request status in newtrainingrequest to "Learning In progress"
                  const updateRequestQuery = `
                    UPDATE newtrainingrequest
                    SET requeststatus = 'Learning In Progress'
                    WHERE requestid = ?;
                  `;
 
                  connection.query(updateRequestQuery,
                    [assignmentData.requestid],
                    (err, updateRequestResult) => {
                      if (err) {
                        return connection.rollback(() => {
                          connection.release();
                          return reject(err);
                        });
                      }
 
                      // Commit the transaction
                      connection.commit((err) => {
                        if (err) {
                          return connection.rollback(() => {
                            connection.release();
                            return reject(err);
                          });
                        }
                        connection.release();
                        resolve({
                          insertResult,
                          incrementResult,
                          updateEmpResult,
                          updateRequestResult
                        });
                      });
                    }
                  );
                }
              );
            }
          );
        });
      });
    });
  });
};
 
module.exports = {
  assignCourse
};
 