//servces/courseStatusService.js

const db = require('../config/db');

const updateCourseStatus = async (assignmentId, newStatus) => {
  const allowedStatuses = ['Completed', 'Incomplete', 'Learning Suspended', 'Completed with Delay'];

   // Validate newStatus
   if (!allowedStatuses.includes(newStatus)) {
    throw new Error('Invalid status');
  }
  
  let connection;
  try {
    connection = await db.promise().getConnection();
    await connection.beginTransaction();

    // 1. Update course status
    const [updateResult] = await connection.query(
      `UPDATE assigned_courses SET status = ? WHERE assignment_id = ?`,
      [newStatus, assignmentId]
    );

    // 2. Get request context
    const [assignment] = await connection.query(
      `SELECT employee_id, requestid FROM assigned_courses WHERE assignment_id = ?`,
      [assignmentId]
    );
    
    const { employee_id, requestid } = assignment[0];

    // 3. Update employee status if needed
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

    // 4. Update request status if needed
    const [employees] = await connection.query(
      `SELECT status FROM emp_newtrainingrequested 
       WHERE requestid = ? AND status IS NOT NULL`,
      [requestid]
    );

    const statusCounts = employees.reduce((acc, { status }) => {
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    let majorityStatus;
    const totalEmployees = employees.length;
    for (const [status, count] of Object.entries(statusCounts)) {
      if (count > totalEmployees / 2) {
        majorityStatus = status;
        break;
      }
    }

    if (majorityStatus) {
      await connection.query(
        `UPDATE newtrainingrequest SET requeststatus = ? 
         WHERE requestid = ?`,
        [majorityStatus, requestid]
      );
    }

    await connection.commit();
    return { 
      success: true,
      message: 'Status updated successfully',
      updated: {
        course: updateResult.affectedRows,
        employee: allSameStatus ? 1 : 0,
        request: majorityStatus ? 1 : 0
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