const { assignCourse } = require('../../services/assignCourseService');
const db = require('../../config/db');
const axios = require('axios');

jest.mock('../../config/db', () => ({
  getConnection: jest.fn(),
}));

jest.mock('axios'); 

describe('assignCourse Service', () => {
  let connectionMock;

  beforeEach(() => {
    connectionMock = {
      beginTransaction: jest.fn((cb) => cb(null)),
      query: jest.fn(),
      commit: jest.fn((cb) => cb(null)),
      rollback: jest.fn((cb) => cb(null)),
      release: jest.fn(),
    };
    db.getConnection.mockImplementation((cb) => cb(null, connectionMock));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return error if database connection fails', async () => {
    db.getConnection.mockImplementation((cb) => cb(new Error('DB Connection Error'), null));
    
    await expect(assignCourse({})).rejects.toThrow('DB Connection Error');
  });

  test('should return error if transaction start fails', async () => {
    connectionMock.beginTransaction.mockImplementationOnce((cb) => cb(new Error('Transaction Error')));
    
    await expect(assignCourse({ requestid: 1 })).rejects.toThrow('Transaction Error');
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test('should successfully assign a course', async () => {
    const assignmentData = {
      requestid: 1,
      employee_id: 101,
      mentor_id: 201,
      course_id: 301,
      coursetype_id: 401,
      completion_date: '2025-05-01',
      comments: 'Test Comment',
      learning_type: 'Online',
      course_assigned_by_id: 501
    };

    connectionMock.query
    .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Insert success
    .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Increment success
    .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Employee update success
    .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Final update success
    .mockImplementationOnce((query, values, cb) => cb(null, [{ userid: 9999 }])); // Fetch userId success

    axios.get.mockResolvedValue({ data: {} }); // Mock API success response

    await expect(assignCourse(assignmentData)).resolves.toEqual({
      insertResult: { affectedRows: 1 },
      incrementResult: { affectedRows: 1 },
      updateEmpResult: { affectedRows: 1 },
      updateRequestResult: { affectedRows: 1 },
    });

    expect(connectionMock.beginTransaction).toHaveBeenCalled();
    expect(connectionMock.commit).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test('should rollback if insert fails', async () => {
    connectionMock.query.mockImplementationOnce((query, values, cb) => cb(new Error('Insert error'), null));

    await expect(assignCourse({ requestid: 1 })).rejects.toThrow('Insert error');

    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test('should rollback if incrementing courses fails', async () => {
    connectionMock.query
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) 
      .mockImplementationOnce((query, values, cb) => cb(new Error('Increment error'), null)); 

    await expect(assignCourse({ requestid: 1 })).rejects.toThrow('Increment error');

    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test('should rollback if employee status update fails', async () => {
    connectionMock.query
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 }))
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 }))
      .mockImplementationOnce((query, values, cb) => cb(new Error('Update error'), null));

    await expect(assignCourse({ requestid: 1 })).rejects.toThrow('Update error');

    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test('should rollback if final request update fails', async () => {
    connectionMock.query
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 }))
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 }))
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 }))
      .mockImplementationOnce((query, values, cb) => cb(new Error('Final update error'), null));

    await expect(assignCourse({ requestid: 1 })).rejects.toThrow('Final update error');

    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });

  test('should throw error if user ID is not found for the employee', async () => {
    connectionMock.query
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Insert success
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Increment success
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Employee update success
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Final update success
      .mockImplementationOnce((query, values, cb) => cb(null, [])); // Empty result for userId
  
    await expect(assignCourse({ requestid: 1, employee_id: 101 })).rejects.toThrow('User ID not found for the employee.');
  
    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  });  

  test('should rollback if commit fails', async () => {
    connectionMock.query
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Insert success
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Increment success
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Employee update success
      .mockImplementationOnce((query, values, cb) => cb(null, { affectedRows: 1 })) // Final update success
      .mockImplementationOnce((query, values, cb) => cb(null, [{ userid: 9999 }])); // Fetch userId success

    axios.get.mockResolvedValue({ data: {} }); // Mock API call success

    connectionMock.commit.mockImplementationOnce((cb) => cb(new Error('Commit failed')));

    await expect(assignCourse({ requestid: 1 })).rejects.toThrow('Commit failed');

    expect(connectionMock.rollback).toHaveBeenCalled();
    expect(connectionMock.release).toHaveBeenCalled();
  }, 10000); // Increased timeout to 10s

});
