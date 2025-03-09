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
 
        // Fetch all courses for the employee and request
        const [courses] = await connection.query(
            `SELECT status FROM assigned_courses WHERE employee_id = ? AND requestid = ?`,
            [employee_id, requestid]
        );
 
        // Custom logic for two courses to update employee status
        if (courses.length === 2) {
const [status1, status2] = courses.map(c => c.status);
 
            let employeeStatus = null;
 
            if ((status1 === 'Completed' && status2 === 'Incomplete') || (status1 === 'Incomplete' && status2 === 'Completed')) {
                employeeStatus = 'Completed';
            } else if ((status1 === 'Incomplete' && status2 === 'Completed with Delay') || (status1 === 'Completed with Delay' && status2 === 'Incomplete')) {
                employeeStatus = 'Completed with Delay';
            } else if ((status1 === 'Completed' && status2 === 'Completed with Delay') || (status1 === 'Completed with Delay' && status2 === 'Completed')) {
                employeeStatus = 'Completed';
            } else {
                employeeStatus = status1; // If both statuses are the same, use either
            }
 
            // Update employee status
            await connection.query(
                `UPDATE emp_newtrainingrequested SET status = ? WHERE emp_id = ? AND requestid = ?`,
                [employeeStatus, employee_id, requestid]
            );
        } else {
            // Update employee status if all courses match
            const allSameStatus = courses.every(c => c.status === newStatus);
            if (allSameStatus) {
                await connection.query(
                    `UPDATE emp_newtrainingrequested SET status = ? WHERE emp_id = ? AND requestid = ?`,
                    [newStatus, employee_id, requestid]
                );
            }
        }
 
        // Calculate request status (EXCLUDE 'Learning Suspended' employees)
        const [employees] = await connection.query(
            `SELECT status FROM emp_newtrainingrequested WHERE requestid = ? AND status != 'Learning Suspended'`,
            [requestid]
        );
 
        let majorityStatus = null;
        const totalEmployees = employees.length;
 
        if (totalEmployees === 2) {
            // Custom logic for exactly two employees
const [status1, status2] = employees.map(e => e.status);
 
            if ((status1 === 'Completed' && status2 === 'Incomplete') || (status1 === 'Incomplete' && status2 === 'Completed')) {
                majorityStatus = 'Completed';
            } else if ((status1 === 'Incomplete' && status2 === 'Completed with Delay') || (status1 === 'Completed with Delay' && status2 === 'Incomplete')) {
                majorityStatus = 'Completed with Delay';
            } else if ((status1 === 'Completed' && status2 === 'Completed with Delay') || (status1 === 'Completed with Delay' && status2 === 'Completed')) {
                majorityStatus = 'Completed';
            } else {
                majorityStatus = status1; // If both statuses are the same, use either
            }
        } else {
            // Majority logic for more than two employees
            const statusCounts = employees.reduce((acc, { status }) => {
                acc[status] = (acc[status] || 0) + 1;
                return acc;
            }, {});
 
            for (const [status, count] of Object.entries(statusCounts)) {
                if (count > totalEmployees * MIN_MAJORITY_RATIO) {
                    majorityStatus = status;
                    break;
                }
            }
        }
 
        // Update request status
        if (majorityStatus) {
            await connection.query(
                `UPDATE newtrainingrequest SET requeststatus = ? WHERE requestid = ?`,
                [majorityStatus, requestid]
            );
        } else {
            // Reset to Learning In Progress if no majority
            await connection.query(
                `UPDATE newtrainingrequest SET requeststatus = 'Learning In Progress' WHERE requestid = ?`,
                [requestid]
            );
        }
 
        await connection.commit();
        return {
            success: true,
            message: 'Status updated successfully',
            updated: {
                course: updateResult.affectedRows,
                employee: 1, // Employee status is always updated
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