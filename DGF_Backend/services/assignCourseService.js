// service/assignCourseService.js
const db = require('../config/db');
const axios = require('axios');
const { promisify } = require('util');
 
// Promisify MySQL methods
const getConnectionAsync = promisify(db.getConnection).bind(db);
const queryAsync = (connection, sql, values) => {
  return new Promise((resolve, reject) => {
    connection.query(sql, values, (err, results) => {
      if (err) reject(err);
      else resolve(results);
    });
  });
};
 
const beginTransactionAsync = (connection) => {
  return new Promise((resolve, reject) => {
    connection.beginTransaction(err => {
      if (err) reject(err);
      else resolve();
    });
  });
};
 
const commitAsync = (connection) => {
  return new Promise((resolve, reject) => {
    connection.commit(err => {
      if (err) reject(err);
      else resolve();
    });
  });
};
 
const rollbackAsync = (connection) => {
  return new Promise((resolve, reject) => {
    connection.rollback(() => {
      reject();
    });
  });
};
 
const assignCourse = async (assignmentData) => {
  let connection;
  try {
    // Get connection from pool
    connection = await getConnectionAsync();
 
    // Begin transaction
    await beginTransactionAsync(connection);
 
    // Insert into assigned_courses
    const insertQuery = `
      INSERT INTO assigned_courses (
        requestid, employee_id, mentor_id, course_id, coursetype_id,
        completion_date, comments, learning_type, course_assigned_by_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);
    `;
    
    const insertValues = [
      assignmentData.requestid,
      assignmentData.employee_id,
      assignmentData.mentor_id,
      assignmentData.course_id,
      assignmentData.coursetype_id,
      assignmentData.completion_date || null,
      assignmentData.comments || null,
      assignmentData.learning_type || null,
      assignmentData.course_assigned_by_id
    ];
 
    const insertResult = await queryAsync(connection, insertQuery, insertValues);
 
    // Increment courses assigned count
    const incrementQuery = `
      UPDATE emp_newtrainingrequested
      SET courses_assigned = courses_assigned + 1
      WHERE emp_id = ? AND requestid = ?;
    `;
    const incrementResult = await queryAsync(connection, incrementQuery, [
      assignmentData.employee_id,
      assignmentData.requestid
    ]);
 
    // Update employee status
    const updateEmpQuery = `
      UPDATE emp_newtrainingrequested
      SET status = 'Learning Initiated'
      WHERE emp_id = ? AND requestid = ?;
    `;
    const updateEmpResult = await queryAsync(connection, updateEmpQuery, [
      assignmentData.employee_id,
      assignmentData.requestid
    ]);
 
    // Update overall request status
    const updateRequestQuery = `
      UPDATE newtrainingrequest
      SET requeststatus = 'Learning In Progress'
      WHERE requestid = ?;
    `;
    const updateRequestResult = await queryAsync(connection, updateRequestQuery, [
      assignmentData.requestid
    ]);
 
    // Get user ID from employee table
    const userIdQuery = `
      SELECT userid FROM employee
      WHERE emp_id = ?;
    `;
    const userIdResult = await queryAsync(connection, userIdQuery, [
      assignmentData.employee_id
    ]);
 
    if (!userIdResult || userIdResult.length === 0) {
      throw new Error('User ID not found for the employee.');
    }
    const userId = userIdResult[0].userid;
 
    // Call external API
const apiUrl = `https://academy.harbingergroup.com/webservice/rest/server.php?wstoken=ec25c26077c47fd4b77f0b72a143df01&wsfunction=enrol_manual_enrol_users&moodlewsrestformat=json&enrolments[0][roleid]=5&enrolments[0][courseid]=${assignmentData.course_id}&enrolments[0][userid]=${userId}`;

console.log('API URL:', apiUrl);
    await axios.get(apiUrl);
 
    // Commit transaction
    await commitAsync(connection);
 
    return {
      insertResult,
      incrementResult,
      updateEmpResult,
      updateRequestResult
    };
  } catch (error) {
    // Rollback transaction if any error occurs
    if (connection) {
      await rollbackAsync(connection).catch(() => {});
    }
    throw error;
  } finally {
    // Always release connection
    if (connection) connection.release();
  }
};
 
module.exports = { assignCourse };