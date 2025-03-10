const { createNewRequest } = require('../../services/newTrainingRequestService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('createNewRequest Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully insert a new training request and notifications', async () => {
    const mockResults = { affectedRows: 1 };
    const mockNotificationResults = { affectedRows: 5 };
    
    db.execute
      .mockImplementationOnce((query, params, callback) => {
        callback(null, mockResults); // Simulate successful training request insert
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null, mockNotificationResults); // Simulate successful notification insert
      });
    
    const requestData = {
      requestid: 1,
      requestonbehalfof: 'Team Lead',
      source: 'Internal',
      trainingobj: 'Advanced JavaScript',
      projectid: null, // Should default to 999
      newprospectname: 'New Client',
      expecteddeadline: '2025-06-01',
      techstack: 'JavaScript, Node.js',
      otherskill: 'React',
      suggestedcompletioncriteria: 'Final Project',
      comments: 'Urgent requirement',
      servicedivision: 'IT',
      requestedbyid: 101,
      org_level: true,
    };

    const result = await createNewRequest(requestData);

    expect(result).toEqual({
      newTrainingRequest: mockResults,
      notification: mockNotificationResults,
    });
    expect(db.execute).toHaveBeenCalledTimes(2);
  });

  test('should handle null requestid and insert successfully', async () => {
    const mockResults = { affectedRows: 1 };
    const mockNotificationResults = { affectedRows: 5 };
    
    db.execute
      .mockImplementationOnce((query, params, callback) => {
        callback(null, mockResults);
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null, mockNotificationResults);
      });
    
    const requestData = {
      requestid: null,
      requestonbehalfof: 'Team Lead',
      source: 'Internal',
      trainingobj: 'Advanced JavaScript',
      projectid: null,
      newprospectname: 'New Client',
      expecteddeadline: '2025-06-01',
      techstack: 'JavaScript, Node.js',
      otherskill: 'React',
      suggestedcompletioncriteria: 'Final Project',
      comments: 'Urgent requirement',
      servicedivision: 'IT',
      requestedbyid: 101,
      org_level: true,
    };

    const result = await createNewRequest(requestData);

    expect(result).toEqual({
      newTrainingRequest: mockResults,
      notification: mockNotificationResults,
    });
    expect(db.execute).toHaveBeenCalledTimes(2);
  });

  test('should throw an error if inserting new training request fails', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });
    
    await expect(createNewRequest({ requestid: 1 })).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if inserting into notifications fails', async () => {
    const mockResults = { affectedRows: 1 };
    
    db.execute
      .mockImplementationOnce((query, params, callback) => {
        callback(null, mockResults);
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(new Error('Notification insert error'), null);
      });
    
    await expect(createNewRequest({ requestid: 1 })).rejects.toThrow('Notification insert error');
    expect(db.execute).toHaveBeenCalledTimes(2);
  });
});