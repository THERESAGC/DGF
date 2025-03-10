const { getCommentsByRequestId, addComments } = require('../../services/commentService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
  execute: jest.fn(),
}));

describe('commentService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe('getCommentsByRequestId', () => {
    test('should return database error if query fails', async () => {
      db.query.mockImplementation((query, values, callback) => callback(new Error('DB error'), null));

      await expect(getCommentsByRequestId(1)).rejects.toThrow('DB error');
    });

    test('should return comments successfully', async () => {
      const mockComments = [
        { id: 1, requestid: 1, comment_text: 'Test Comment', created_by: 'User1', created_date: '2025-03-08' },
      ];

      db.query.mockImplementation((query, values, callback) => callback(null, mockComments));

      await expect(getCommentsByRequestId(1)).resolves.toEqual(mockComments);
    });
  });

  describe('addComments', () => {
    test('should return error if comment insertion fails', async () => {
      db.execute.mockImplementationOnce((query, values, callback) => callback(new Error('Insert error'), null));

      await expect(addComments(1, 'New Comment', 'User1', null, 'Pending')).rejects.toThrow('Insert error');
    });

    test('should insert comment successfully without status update', async () => {
      db.execute.mockImplementationOnce((query, values, callback) => callback(null, { insertId: 101 }));

      await expect(addComments(1, 'New Comment', 'User1', null, 'Pending')).resolves.toBe(101);
    });

    test('should return error if request status update fails', async () => {
      db.execute
        .mockImplementationOnce((query, values, callback) => callback(null, { insertId: 102 }))
        .mockImplementationOnce((query, values, callback) => callback(new Error('Update error'), null));

      await expect(addComments(1, 'Approval Comment', 'User2', null, 'Approval Requested')).rejects.toThrow('Update error');
    });

    test('should insert comment and update status successfully when required', async () => {
      db.execute
        .mockImplementationOnce((query, values, callback) => callback(null, { insertId: 103 }))
        .mockImplementationOnce((query, values, callback) => callback(null, { affectedRows: 1 }));

      await expect(addComments(1, 'Approval Comment', 'User2', null, 'Approval Requested')).resolves.toBe(103);
    });
  });
});
