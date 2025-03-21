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

  test('should throw error for invalid status', async () => {
    await expect(updateCourseStatus(1, 'InvalidStatus')).rejects.toThrow(
      'Invalid status: InvalidStatus. Allowed values: Completed, Incomplete, Learning Suspended, Completed with Delay'
    );
  });

  test('should throw an error if database connection fails', async () => {
    db.promise().getConnection.mockRejectedValue(new Error('DB Connection Error'));

    await expect(updateCourseStatus(1, 'Completed')).rejects.toThrow('Database operation failed: DB Connection Error');
  });

  test('should successfully update course status', async () => {
    connectionMock.query
        .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
        .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
        .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // All courses have the same status
        .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Request-level status calculation
        .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Completed' }]]) // Employees status array (FIX HERE)
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

  test('should update request status based on majority', async () => {
    connectionMock.query
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
      .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Courses have different statuses
      .mockResolvedValueOnce([
        [{ status: 'Completed' }, { status: 'Completed' }, { status: 'Incomplete' }],
      ]) // Majority check
      .mockResolvedValueOnce([
        [{ status: 'Completed' }, { status: 'Completed' }, { status: 'Incomplete' }], // Fix: Ensure array structure
      ]) // Employees list for majority calculation
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status
  
    await updateCourseStatus(1, 'Completed');
  
    expect(connectionMock.query).toHaveBeenCalledWith(
      'UPDATE newtrainingrequest SET requeststatus = ? WHERE requestid = ?',
      ['Completed', 202]
    );
  });

  test('should reset request status if no majority is found', async () => {
    connectionMock.query
      .mockResolvedValueOnce([{ affectedRows: 1 }]) // Update course status
      .mockResolvedValueOnce([[{ employee_id: 101, requestid: 202 }]]) // Get employee and request ID
      .mockResolvedValueOnce([[{ status: 'Completed' }, { status: 'Incomplete' }]]) // Different course statuses
      .mockResolvedValueOnce([
        [{ status: 'Completed' }, { status: 'Incomplete' }, { status: 'Learning Suspended' }],
      ]) // No majority
      .mockResolvedValueOnce([
        [{ status: 'Completed' }, { status: 'Incomplete' }, { status: 'Learning Suspended' }], // Fix: Ensure array structure
      ]) // Employees list for majority calculation
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Update request status
  
    await updateCourseStatus(1, 'Completed');
  
    expect(connectionMock.query).toHaveBeenCalledWith(
      'UPDATE newtrainingrequest SET requeststatus = \'Learning In Progress\' WHERE requestid = ?',
      [202]
    );
  });
  

  test('should rollback if query execution fails', async () => {
    connectionMock.query.mockRejectedValueOnce(new Error('Query Execution Error'));

    await expect(updateCourseStatus(1, 'Completed')).rejects.toThrow('Database operation failed: Query Execution Error');

    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  
  
});


