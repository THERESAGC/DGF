// const { updateCourseStatus } = require('../../services/courseStatusService');
// const db = require('../../config/db');

// jest.mock('../../config/db', () => ({
//   promise: jest.fn().mockReturnValue({
//     getConnection: jest.fn(),
//   }),
// }));

// describe('updateCourseStatus Service', () => {
//   let connectionMock;

//   beforeEach(() => {
//     connectionMock = {
//       beginTransaction: jest.fn(),
//       query: jest.fn(),
//       commit: jest.fn(),
//       rollback: jest.fn(),
//       release: jest.fn(),
//     };
//     db.promise().getConnection.mockResolvedValue(connectionMock);
//     jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
//   });

//   afterEach(() => {
//     jest.clearAllMocks();
//   });

//   test('should successfully update course status', async () => {
//     connectionMock.query
//         .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//         .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//         .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // All courses have the same status
//         .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Request-level status calculation
//         .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Employees status array (FIX HERE)
//         .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status

//     const result = await updateCourseStatus(1, 'Completed');

//     expect(result).toEqual({
//       success: true,
//       message: 'Status updated successfully',
//       updated: {
//         course: 1,
//         employee: 1,
//         request: 1,
//       },
//     });

//     expect(connectionMock.beginTransaction).toHaveBeenCalled();
//     expect(connectionMock.commit).toHaveBeenCalled();
//     expect(connectionMock.release).toHaveBeenCalled();
//   });

//   test('should update employee status to "Completed with Delay" when one status is "Incomplete" and the other is "Completed with Delay"', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Incomplete' }, { status: 'Completed with Delay' }]]) // Employee course statuses
//       .mockResolvedValueOnce([[{ status: 'Incomplete' }, { status: 'Completed with Delay' }]]) // Employees list for status calculation
//       .mockResolvedValueOnce([[{ status: 'Incomplete' }, { status: 'Completed with Delay' }]]) // Fix: Ensure employees array is correctly structured
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status

//     await updateCourseStatus(1, 'Completed with Delay');

//     expect(connectionMock.query).toHaveBeenCalledWith(
//       'UPDATE newtrainingrequest SET requeststatus = ? WHERE requestid = ?',
//       ['Completed with Delay', 202]
//     );
//   });

//   test('should update employee status to "Completed" when one status is "Completed" and the other is "Completed with Delay"', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed with Delay' }]]) // Employee course statuses
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed with Delay' }]]) // Employees list for status calculation
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed with Delay' }]]) // Fix: Ensure employees array is correctly structured
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status

//     await updateCourseStatus(1, 'Completed');

//     expect(connectionMock.query).toHaveBeenCalledWith(
//       'UPDATE emp_newtrainingrequested SET status = ? WHERE emp_id = ? AND requestid = ?',
//       ['Completed', 101, 202]
//     );
//   });

//   test('should update employee status when all courses have the same status (else block)', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }, { status: 'Completed' }]]) // Employee course statuses
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Employees list for status calculation
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Fix: Ensure employees array is correctly structured
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status

  
//       const result = await updateCourseStatus(1, 'Completed');

//     expect(connectionMock.query).toHaveBeenCalledTimes(6);

//     expect(result).toEqual({
//         success: true,
//         message: 'Status updated successfully',
//         updated: { course: 1, employee: 1, request: 1 },
//     });
//   });

//   test('should update employee status when all courses do not have the same status (else block)', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }, { status: 'Completed' }]]) // Employee course statuses
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Employees list for status calculation
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Fix: Ensure employees array is correctly structured
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status

  
//       const result = await updateCourseStatus(1, 'Completed');

//     expect(connectionMock.query).toHaveBeenCalledTimes(5);

//     expect(result).toEqual({
//         success: true,
//         message: 'Status updated successfully',
//         updated: { course: 1, employee: 1, request: 1 },
//     });
//   });

//   test('should update request status to "Completed" if two employees have one "Completed" and one "Incomplete"', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Employee course statuses
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Employees list for status calculation
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Fix: Ensure employees array is correctly structured
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status
  
//     await updateCourseStatus(1, 'Completed');
  
//     expect(connectionMock.query).toHaveBeenCalledWith(
//       'UPDATE newtrainingrequest SET requeststatus = ? WHERE requestid = ?',
//       ['Completed', 202]
//     );
//   });

//   test('should update request status to "Completed" if two employees have one "Completed with Delay" and one "Incomplete"', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Completed with Delay' }, { status: 'Incomplete' }]]) // Employee course statuses
//       .mockResolvedValueOnce([[{ status: 'Completed with Delay' }, { status: 'Incomplete' }]]) // Employees list for status calculation
//       .mockResolvedValueOnce([[{ status: 'Completed with Delay' }, { status: 'Incomplete' }]]) // Fix: Ensure employees array is correctly structured
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status
  
//     await updateCourseStatus(1, 'Completed');
  
//     expect(connectionMock.query).toHaveBeenCalledTimes(6);
//   });

//   test('should update request status to "Completed" if two employees have one "Completed with Delay" and one "Completed"', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Completed with Delay' }, { status: 'Completed' }]]) // Employee course statuses
//       .mockResolvedValueOnce([[{ status: 'Completed with Delay' }, { status: 'Completed' }]]) // Employees list for status calculation
//       .mockResolvedValueOnce([[{ status: 'Completed with Delay' }, { status: 'Completed' }]]) // Fix: Ensure employees array is correctly structured
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status
  
//     await updateCourseStatus(1, 'Completed');
  
//     expect(connectionMock.query).toHaveBeenCalledTimes(6);
//   });

//   test('should update request status based on majority', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Learning Initiated' }, { status: 'Completed' }]]) // Courses have different statuses
//       .mockResolvedValueOnce([
//         [{ status: 'Learning Initiated' }, { status: 'Completed' }, { status: 'Completed' }],
//       ]) // Majority check
//       .mockResolvedValueOnce([
//         [{ status: 'Learning Initiated' }, { status: 'Completed' }, { status: 'Completed' }], // Fix: Ensure array structure
//       ]) // Employees list for majority calculation
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status
  
//     const result = await updateCourseStatus(1, 'Completed');
  
//     expect(connectionMock.query).toHaveBeenCalledWith(
//       'UPDATE newtrainingrequest SET requeststatus = ? WHERE requestid = ?',
//       ['Completed', 202]
//     );
//   });

//   test('should reset request status if no majority is found', async () => {
//     connectionMock.query
//       .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
//       .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
//       .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Different course statuses
//       .mockResolvedValueOnce([
//         [{ status: 'Completed' }, { status: 'Incomplete' }, { status: 'Learning Suspended' }],
//       ]) // No majority
//       .mockResolvedValueOnce([
//         [{ status: 'Completed' }, { status: 'Incomplete' }, { status: 'Learning Suspended' }], // Fix: Ensure array structure
//       ]) // Employees list for majority calculation
//       .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status
  
//     await updateCourseStatus(1, 'Completed');
  
//     expect(connectionMock.query).toHaveBeenCalledWith(
//       'UPDATE newtrainingrequest SET requeststatus = \'Learning In Progress\' WHERE requestid = ?',
//       [202]
//     );
//   });

//   test('should rollback if query execution fails', async () => {
//     connectionMock.query.mockRejectedValueOnce(new Error('Query Execution Error'));

//     await expect(updateCourseStatus(1, 'Completed')).rejects.toThrow('Database operation failed: Query Execution Error');

//     expect(connectionMock.rollback).toHaveBeenCalled();
//     expect(connectionMock.release).toHaveBeenCalled();
//   });

//   test('should throw error for invalid status', async () => {
//     await expect(updateCourseStatus(1, 'InvalidStatus')).rejects.toThrow(
//       'Invalid status: InvalidStatus. Allowed values: Completed, Incomplete, Learning Suspended, Completed with Delay'
//     );
//   });

//   test('should throw an error if database connection fails', async () => {
//     db.promise().getConnection.mockRejectedValue(new Error('DB Connection Error'));

//     await expect(updateCourseStatus(1, 'Completed')).rejects.toThrow('Database operation failed: DB Connection Error');
//   });
// });




const { updateCourseStatus } = require('../../services/courseStatusService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  promise: jest.fn().mockReturnValue({
    getConnection: jest.fn(),
  }),
}));

describe('updateCourseStatus Service', () => {
  let connectionMock;

  beforeEach(() => {
    connectionMock = {
      beginTransaction: jest.fn(),
      query: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    };
    db.promise().getConnection.mockResolvedValue(connectionMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully update course status', async () => {
    connectionMock.query
      .mockResolvedValueOnce([[{ status: 'Learning Initiated' }]]) // Get current course status
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
      .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // All courses have the same status
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Employee statuses
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update employee status
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Employees status for request
      .mockResolvedValueOnce([[{ requeststatus: 'Approval Requested' }]]) // Get current request status
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status

    const result = await updateCourseStatus(1, 'Completed');

    expect(result).toEqual({
      success: true,
      message: 'Status updated successfully',
      updated: {
        course: 1,
        employee: 1,
        request: 1,
      },
    });

    expect(connectionMock.beginTransaction).toHaveBeenCalled();
    expect(connectionMock.commit).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test('should throw an error for invalid status', async () => {
    await expect(updateCourseStatus(1, 'InvalidStatus')).rejects.toThrow(
      'Invalid status: InvalidStatus. Allowed values: Completed with Delay, Completed, Incomplete, Learning Suspended'
    );
  });

  test('should rollback transaction and throw error on failure', async () => {
    connectionMock.query.mockRejectedValueOnce(new Error('Database error'));

    await expect(updateCourseStatus(1, 'Completed')).rejects.toThrow(
      'Database operation failed: Database error'
    );

    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test.skip('should not update employee or request status if some courses are still Learning Initiated', async () => {
    connectionMock.query
      .mockResolvedValueOnce([[{ status: 'Learning Initiated' }]]) // Get current course status
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
      .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
      .mockResolvedValueOnce([[{ status: 'Learning Initiated' }, { status: 'Completed' }]]); // One course still Learning Initiated

    const result = await updateCourseStatus(1, 'Completed');

    expect(result).toEqual({
      success: true,
      message: 'Status updated successfully',
      updated: {
        course: 1,
        employee: 0,
        request: 0,
      },
    });

    expect(connectionMock.commit).toHaveBeenCalled();
  });

  test('should handle scenarios with multiple courses and determine majority status correctly', async () => {
    connectionMock.query
      .mockResolvedValueOnce([[{ status: 'Completed' }]]) // Get current course status
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
      .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed with Delay' }, { status: 'Incomplete' }]]) // Courses for the employee
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Employees status
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update employee status
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Employees status for request
      .mockResolvedValueOnce([[{ requeststatus: 'Approval Requested' }]]) // Get current request status
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status

    const result = await updateCourseStatus(1, 'Completed');

    expect(result).toEqual({
      success: true,
      message: 'Status updated successfully',
      updated: {
        course: 1,
        employee: 1,
        request: 1,
      },
    });
  });

  test('should throw an error if database connection fails', async () => {
    db.promise().getConnection.mockRejectedValue(new Error('DB Connection Error'));

    await expect(updateCourseStatus(1, 'Completed')).rejects.toThrow('Database operation failed: DB Connection Error');
  });
    
      

});
