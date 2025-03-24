const db = require('../config/db');
 
const updateCourseStatus = async (assignmentId, newStatus) => {
  const allowedStatuses = ['Completed with Delay', 'Completed', 'Incomplete', 'Learning Suspended'];
  const MIN_MAJORITY_RATIO = 0.5;
 
  if (!allowedStatuses.includes(newStatus)) {
    throw new Error(`Invalid status: ${newStatus}. Allowed values: ${allowedStatuses.join(', ')}`);
  }
 
  let connection;
  try {
    connection = await db.promise().getConnection();
    await connection.beginTransaction();
 
    // 1. Get current course status
    const [currentCourse] = await connection.query(
      `SELECT status FROM assigned_courses WHERE assignment_id = ?`,
      [assignmentId]
    );
    const oldCourseStatus = currentCourse[0].status;
 
    // 2. Update course status with timestamps
    //    Always update status_modified_date, and conditionally set status_assigned_date
    const [updateResult] = await connection.query(
      `UPDATE assigned_courses
       SET status = ?,
           status_modified_date = CURRENT_TIMESTAMP,
           status_assigned_date = IF( ? AND status_assigned_date IS NULL, CURRENT_TIMESTAMP, status_assigned_date )
       WHERE assignment_id = ?`,
      [
        newStatus,
        oldCourseStatus === 'Learning Initiated' && newStatus !== 'Learning Initiated',
        assignmentId
      ]
    );
 
    // Get request context for employee and request
    const [assignment] = await connection.query(
      `SELECT employee_id, requestid FROM assigned_courses WHERE assignment_id = ?`,
      [assignmentId]
    );
    const { employee_id, requestid } = assignment[0];
 
    // Fetch all courses for the employee and request
    const [courses] = await connection.query(
      `SELECT status FROM assigned_courses WHERE employee_id = ? AND requestid = ?`,
      [employee_id, requestid]
    );
 
    // Check if any course is still in Learning Initiated state
    const hasLearningInitiated = courses.some(c => c.status === 'Learning Initiated');
 
    // 3. Update employee status if no course is in Learning Initiated state
    if (!hasLearningInitiated) {
      let employeeStatus = null;
      // Calculate employee status based on course statuses
      if (courses.length === 1) {
        employeeStatus = courses[0].status;
      } else if (courses.length === 2) {
        const [status1, status2] = courses.map(c => c.status);
        if (
          (status1 === 'Completed with Delay' && status2 === 'Completed') ||
          (status1 === 'Completed' && status2 === 'Completed with Delay')
        ) {
          employeeStatus = 'Completed';
        } else if (
          (status1 === 'Completed with Delay' && status2 === 'Incomplete') ||
          (status1 === 'Incomplete' && status2 === 'Completed with Delay') ||
          (status1 === 'Completed with Delay' && status2 === 'Learning Suspended') ||
          (status1 === 'Learning Suspended' && status2 === 'Completed with Delay')
        ) {
          employeeStatus = 'Completed with Delay';
        } else if (
          (status1 === 'Completed' && status2 === 'Incomplete') ||
          (status1 === 'Incomplete' && status2 === 'Completed') ||
          (status1 === 'Completed' && status2 === 'Learning Suspended') ||
          (status1 === 'Learning Suspended' && status2 === 'Completed')
        ) {
          employeeStatus = 'Completed';
        } else if (
          (status1 === 'Incomplete' && status2 === 'Learning Suspended') ||
          (status1 === 'Learning Suspended' && status2 === 'Incomplete')
        ) {
          employeeStatus = 'Incomplete';
        } else {
          employeeStatus = status1; // Both statuses are the same
        }
      } else if (courses.length === 3) {
        const statuses = courses.map(c => c.status);
        const uniqueStatuses = [...new Set(statuses)];
        if (uniqueStatuses.length === 3) {
          const includesCWD = uniqueStatuses.includes('Completed with Delay');
          const includesC = uniqueStatuses.includes('Completed');
          const includesI = uniqueStatuses.includes('Incomplete');
          const includesS = uniqueStatuses.includes('Learning Suspended');
          if ((includesCWD && includesC && includesI) || (includesCWD && includesC && includesS)) {
            employeeStatus = 'Completed';
          } else if ((includesC && includesI && includesS) || (includesI && includesS && includesCWD)) {
            employeeStatus = 'Incomplete';
          } else {
            const priority = ['Completed', 'Completed with Delay', 'Incomplete', 'Learning Suspended'];
            for (const status of priority) {
              if (uniqueStatuses.includes(status)) {
                employeeStatus = status;
                break;
              }
            }
          }
        } else {
          // When two statuses are the same and one is different
          const statusCounts = statuses.reduce((acc, status) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          let maxCount = 0;
          let majorityStatus = null;
          const priority = ['Completed', 'Completed with Delay', 'Incomplete', 'Learning Suspended'];
          for (const [status, count] of Object.entries(statusCounts)) {
            if (count > maxCount) {
              maxCount = count;
              majorityStatus = status;
            } else if (count === maxCount) {
              const currentIdx = priority.indexOf(majorityStatus);
              const newIdx = priority.indexOf(status);
              majorityStatus = newIdx < currentIdx ? status : majorityStatus;
            }
          }
          employeeStatus = majorityStatus;
        }
      }
 
      // Get current employee status
      const [currentEmployee] = await connection.query(
        `SELECT status FROM emp_newtrainingrequested WHERE emp_id = ? AND requestid = ?`,
        [employee_id, requestid]
      );
      const oldEmployeeStatus = currentEmployee[0]?.status || 'Not Assigned';
 
      // Update employee status with the same logic for timestamps:
      // Always update status_modified_date and conditionally set status_assigned_date.
      await connection.query(
        `UPDATE emp_newtrainingrequested
         SET status = ?,
             status_modified_date = CURRENT_TIMESTAMP,
             status_assigned_date = IF( ? AND status_assigned_date IS NULL, CURRENT_TIMESTAMP, status_assigned_date )
         WHERE emp_id = ? AND requestid = ?`,
        [
          employeeStatus,
          oldEmployeeStatus === 'Not Assigned' && employeeStatus !== 'Not Assigned',
          employee_id,
          requestid
        ]
      );
    }
 
    // 4. Update request status with timestamps
    const [employees] = await connection.query(
      `SELECT status FROM emp_newtrainingrequested WHERE requestid = ?`,
      [requestid]
    );
    const hasLearningInitiatedEmployees = employees.some(e => e.status === 'Learning Initiated');
    let majorityStatus = null;
    // Calculate request status only if no employee is still in Learning Initiated
    if (!hasLearningInitiatedEmployees) {
      const totalEmployees = employees.length;
      const statuses = employees.map(e => e.status);
      // Handle specific 3-employee cases
      if (totalEmployees === 3) {
        const uniqueStatuses = [...new Set(statuses)];
        if (uniqueStatuses.includes('Completed with Delay') && uniqueStatuses.includes('Completed') && uniqueStatuses.includes('Incomplete')) {
          majorityStatus = 'Completed';
        } else if (uniqueStatuses.includes('Completed') && uniqueStatuses.includes('Incomplete') && uniqueStatuses.includes('Learning Suspended')) {
          majorityStatus = 'Incomplete';
        } else if (uniqueStatuses.includes('Incomplete') && uniqueStatuses.includes('Learning Suspended') && uniqueStatuses.includes('Completed with Delay')) {
          majorityStatus = 'Incomplete';
        } else if (uniqueStatuses.includes('Completed with Delay') && uniqueStatuses.includes('Completed') && uniqueStatuses.includes('Learning Suspended')) {
          majorityStatus = 'Completed';
        }
      }
      // For other cases, use the following logic
      if (!majorityStatus) {
        if (totalEmployees === 1) {
          majorityStatus = employees[0].status;
        } else if (totalEmployees === 2) {
          const [status1, status2] = employees.map(e => e.status);
          if (
            (status1 === 'Completed with Delay' && status2 === 'Completed') ||
            (status1 === 'Completed' && status2 === 'Completed with Delay')
          ) {
            majorityStatus = 'Completed';
          } else if (
            (status1 === 'Completed with Delay' && status2 === 'Incomplete') ||
            (status1 === 'Incomplete' && status2 === 'Completed with Delay') ||
            (status1 === 'Completed with Delay' && status2 === 'Learning Suspended') ||
            (status1 === 'Learning Suspended' && status2 === 'Completed with Delay')
          ) {
            majorityStatus = 'Completed with Delay';
          } else if (
            (status1 === 'Completed' && status2 === 'Incomplete') ||
            (status1 === 'Incomplete' && status2 === 'Completed') ||
            (status1 === 'Completed' && status2 === 'Learning Suspended') ||
            (status1 === 'Learning Suspended' && status2 === 'Completed')
          ) {
            majorityStatus = 'Completed';
          } else if (
            (status1 === 'Incomplete' && status2 === 'Learning Suspended') ||
            (status1 === 'Learning Suspended' && status2 === 'Incomplete')
          ) {
            majorityStatus = 'Incomplete';
          } else {
            majorityStatus = status1;
          }
        } else {
          const statusCounts = statuses.reduce((acc, status) => {
            acc[status] = (acc[status] || 0) + 1;
            return acc;
          }, {});
          // Determine the status with the maximum count, using a priority in case of ties.
          let maxCount = 0;
          let maxStatus = null;
          const priority = ['Completed', 'Completed with Delay', 'Incomplete', 'Learning Suspended'];
          for (const [status, count] of Object.entries(statusCounts)) {
            if (count > maxCount) {
              maxCount = count;
              maxStatus = status;
            } else if (count === maxCount) {
              const currentIdx = priority.indexOf(maxStatus);
              const newIdx = priority.indexOf(status);
              maxStatus = newIdx < currentIdx ? status : maxStatus;
            }
          }
          if (maxCount > totalEmployees * MIN_MAJORITY_RATIO) {
            majorityStatus = maxStatus;
          } else if (totalEmployees % 2 === 0 && maxCount === totalEmployees / 2) {
            majorityStatus = maxStatus;
          }
        }
      }
    }
 
    // Update request status only if no employee is in Learning Initiated state and we have a majorityStatus
    if (!hasLearningInitiatedEmployees && majorityStatus) {
      // Get current request status
      const [currentRequest] = await connection.query(
        `SELECT requeststatus FROM newtrainingrequest WHERE requestid = ?`,
        [requestid]
      );
      const oldRequestStatus = currentRequest[0]?.requeststatus || 'Approval Requested';
 
      await connection.query(
        `UPDATE newtrainingrequest
         SET requeststatus = ?,
             status_modified_date = CURRENT_TIMESTAMP,
             status_assigned_date = IF( ? AND status_assigned_date IS NULL, CURRENT_TIMESTAMP, status_assigned_date )
         WHERE requestid = ?`,
        [
          majorityStatus,
          oldRequestStatus === 'Approval Requested' && majorityStatus !== 'Approval Requested',
          requestid
        ]
      );
    }
 
    await connection.commit();
    return { success: true, message: 'Status updated successfully', updated: { course: updateResult.affectedRows, employee: 1, request: 1 } };
  } catch (error) {
    if (connection) await connection.rollback();
    throw new Error(`Database operation failed: ${error.message}`);
  } finally {
    if (connection) connection.release();
  }
};
 
module.exports = { updateCourseStatus };