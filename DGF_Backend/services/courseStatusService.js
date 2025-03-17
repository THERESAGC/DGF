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
 
        // Check if any course is still in Learning Initiated state
        const hasLearningInitiated = courses.some(c => c.status === 'Learning Initiated');
 
        // Update employee status if no courses are in Learning Initiated
        if (!hasLearningInitiated) {
            let employeeStatus = null;
 
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
                    employeeStatus = status1; // Both statuses are same
                }
            } else if (courses.length === 3) {
const statuses = courses.map(c => c.status);
                const uniqueStatuses = [...new Set(statuses)];
 
                if (uniqueStatuses.length === 3) {
                    const includesCWD = uniqueStatuses.includes('Completed with Delay');
                    const includesC = uniqueStatuses.includes('Completed');
                    const includesI = uniqueStatuses.includes('Incomplete');
                    const includesS = uniqueStatuses.includes('Learning Suspended');
 
                    if ((includesCWD && includesC && includesI) ||
                        (includesCWD && includesC && includesS)) {
                        employeeStatus = 'Completed';
                    } else if ((includesC && includesI && includesS) ||
                               (includesI && includesS && includesCWD)) {
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
 
            // Update employee status
            await connection.query(
                `UPDATE emp_newtrainingrequested SET status = ? WHERE emp_id = ? AND requestid = ?`,
                [employeeStatus, employee_id, requestid]
            );
        }
 
        // Calculate request status (exclude Learning Initiated employees)
        const [employees] = await connection.query(
            `SELECT status FROM emp_newtrainingrequested WHERE requestid = ?`,
            [requestid]
        );
        // Check if any employee has Learning Initiated status
        const hasLearningInitiatedEmployees = employees.some(e => e.status === 'Learning Initiated');
 
        let majorityStatus = null;
 
        // Do not update request status if any employee has Learning Initiated status
        if (!hasLearningInitiatedEmployees) {
            const totalEmployees = employees.length;
const statuses = employees.map(e => e.status);
 
            // Handle specific 3-employee cases
            if (totalEmployees === 3) {
                const uniqueStatuses = [...new Set(statuses)];
 
                // Case 1: CWD, Completed, Incomplete
                if (uniqueStatuses.includes('Completed with Delay') &&
                    uniqueStatuses.includes('Completed') &&
                    uniqueStatuses.includes('Incomplete')) {
                    majorityStatus = 'Completed';
                }
                // Case 2: Completed, Incomplete, Suspended
                else if (uniqueStatuses.includes('Completed') &&
                         uniqueStatuses.includes('Incomplete') &&
                         uniqueStatuses.includes('Learning Suspended')) {
                    majorityStatus = 'Incomplete';
                }
                // Case 3: Incomplete, Suspended, CWD
                else if (uniqueStatuses.includes('Incomplete') &&
                         uniqueStatuses.includes('Learning Suspended') &&
                         uniqueStatuses.includes('Completed with Delay')) {
                    majorityStatus = 'Incomplete';
                }
                // Case 4: CWD, Completed, Suspended
                else if (uniqueStatuses.includes('Completed with Delay') &&
                         uniqueStatuses.includes('Completed') &&
                         uniqueStatuses.includes('Learning Suspended')) {
                    majorityStatus = 'Completed';
                }
            }
 
            // If not a special 3-employee case, proceed with existing logic
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
 
                    // Check for majority
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
 
        // Update request status only if no employee has Learning Initiated status
        if (!hasLearningInitiatedEmployees && majorityStatus) {
            await connection.query(
                `UPDATE newtrainingrequest SET requeststatus = ? WHERE requestid = ?`,
                [majorityStatus, requestid]
            );
        }
 
        await connection.commit();
        return {
            success: true,
            message: 'Status updated successfully',
            updated: {
                course: updateResult.affectedRows,
                employee: 1,
                request: 1
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