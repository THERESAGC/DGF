//services/courseStatusService.js

const db = require('../config/db');

const updateCourseStatus = async (assignmentId, newStatus) => {
  const allowedStatuses = ['Completed', 'Incomplete', 'Learning Suspended', 'Completed with Delay'];
  const MIN_MAJORITY_RATIO = 0.5;

  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Allowed values: ${allowedStatuses.join(', ')}`);
  }

  let connection;
  try {
    connection = await db.promise().getConnection();
    await connection.beginTransaction();

    // Update course status
    const [updateResult] = await connection.query(
      `UPDATE assigned_courses SET status = ? WHERE assignment_id = ?`,
      [newStatus, assignmentId]
    );

    // Get request context
    const [assignment] = await connection.query(
      `SELECT employee_id, requestid FROM assigned_courses WHERE assignment_id = ?`,
      [assignmentId]
    );
    
    const { employee_id, requestid } = assignment[0];

    // Update employee status if all courses match
    const [courses] = await connection.query(
      `SELECT status FROM assigned_courses 
       WHERE employee_id = ? AND requestid = ?`,
      [employee_id, requestid]
    );

    const allSameStatus = courses.every(c => c.status === newStatus);
    if (allSameStatus) {
      await connection.query(
        `UPDATE emp_newtrainingrequested SET status = ? 
         WHERE emp_id = ? AND requestid = ?`,
        [newStatus, employee_id, requestid]
      );
    }

    // Calculate request status
    const [employees] = await connection.query(
      `SELECT status FROM emp_newtrainingrequested 
       WHERE requestid = ?`,
      [requestid]
    );

    const statusCounts = employees.reduce((acc, { status }) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    let majorityStatus = null;
    const totalEmployees = employees.length;
    
    // Find first status with strict majority
    for (const [status, count] of Object.entries(statusCounts)) {
      if (count > totalEmployees * MIN_MAJORITY_RATIO) {
        majorityStatus = status;
        break;
      }
    }

    // Update request status
    if (majorityStatus) {
      await connection.query(
        `UPDATE newtrainingrequest SET requeststatus = ? 
         WHERE requestid = ?`,
        [majorityStatus, requestid]
      );
    } else {
      // Reset to Learning In Progress if no majority
      await connection.query(
        `UPDATE newtrainingrequest SET requeststatus = 'Learning In Progress' 
         WHERE requestid = ?`,
        [requestid]
      );
    }

    await connection.commit();
    return { 
      success: true,
      message: 'Status updated successfully',
      updated: {
        course: updateResult.affectedRows,
        employee: allSameStatus ? 1 : 0,
        request: 1 // Always update request status
      }
    };
  } catch (error) {
    if (connection) await connection.rollback();
    throw new Error(`Database operation failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};

module.exports = { updateCourseStatus };