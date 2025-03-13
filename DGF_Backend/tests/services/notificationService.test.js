const { getNotifications, markNotificationAsRead, createNotificationOnStatusChange } = require('../../services/notificationService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Notification Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch notifications for CapDev role', async () => {
    const mockResults = [{ id: 1, requestid: 101, is_read: false }];
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getNotifications(1, 4);
    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
  });

  test('should fetch notifications for SPOC role', async () => {
    const mockResults = [{ id: 2, requestid: 102, is_read: false }];
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getNotifications(1, 10);
    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
  });

  test('should fetch notifications for Requester role', async () => {
    const mockResults = [{ id: 3, requestid: 103, is_read: false }];
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getNotifications(1, 1);
    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1, 1], expect.any(Function));
  });

  test('should handle database error when fetching notifications', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getNotifications(1, 4)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should mark a notification as read', async () => {
    const mockResults = { affectedRows: 1 };
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await markNotificationAsRead(1, 5);
    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [5, 1], expect.any(Function));
  });

  test('should handle database error when marking notification as read', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Update error'), null);
    });

    await expect(markNotificationAsRead(1, 5)).rejects.toThrow('Update error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should create notifications when status changes', async () => {
    db.execute
      .mockImplementationOnce((query, params, callback) => {
        callback(null, [{ requestedbyid: 1, requestonbehalfof: 2, requeststatus: 'Approved' }]);
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { affectedRows: 1 });
      });

    const result = await createNotificationOnStatusChange(101, 3);
    expect(result.length).toBe(2);
    expect(db.execute).toHaveBeenCalledTimes(3);
  });

  test('should handle error when retrieving request details for status change', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Fetch error'), null);
    });

    await expect(createNotificationOnStatusChange(101, 3)).rejects.toThrow('Fetch error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should handle error when inserting notifications for status change', async () => {
    db.execute
      .mockImplementationOnce((query, params, callback) => {
        callback(null, [{ requestedbyid: 1, requestonbehalfof: 2, requeststatus: 'Approved' }]);
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(new Error('Insert error'), null);
      });

    await expect(createNotificationOnStatusChange(101, 3)).rejects.toThrow('Insert error');
    expect(db.execute).toHaveBeenCalledTimes(3);
  });

  test('should return an empty array if there are no recipients for status change notification', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, [{ requestedbyid: 3, requestonbehalfof: 3, requeststatus: 'Approved' }]); // Both IDs match approverId
    });
  
    const result = await createNotificationOnStatusChange(101, 3);
    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
  
});
