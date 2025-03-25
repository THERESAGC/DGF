const db = require('../../config/db');
const moment = require('moment');
const {
  getTrainingCommentsByAssignmentId,
  addTrainingComments,
} = require('../../services/initiateTrainingCommentsService');

jest.mock('../../config/db');

describe('initiateTrainingCommentsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe('getTrainingCommentsByAssignmentId', () => {
    test('should return comments successfully', async () => {
      const mockComments = [{ comment_id: 1, comment_text: 'Test comment' }];
      db.query.mockImplementation((query, values, callback) => {
        callback(null, mockComments);
      });

      const result = await getTrainingCommentsByAssignmentId(1);
      expect(result).toEqual(mockComments);
      expect(db.query).toHaveBeenCalledWith(
        expect.any(String),
        [1],
        expect.any(Function)
      );
    });

    test('should reject on database error', async () => {
      db.query.mockImplementation((query, values, callback) => {
        callback(new Error('DB error'), null);
      });

      await expect(getTrainingCommentsByAssignmentId(1)).rejects.toThrow('DB error');
    });
  });

  describe('addTrainingComments', () => {
    test('should insert comment successfully', async () => {
      const mockResult = { insertId: 1 };
      db.execute.mockImplementation((query, values, callback) => {
        callback(null, mockResult);
      });

      const result = await addTrainingComments(1, 'Test comment', 'User1', '2024-03-17 12:00:00');
      expect(result).toEqual(mockResult);
      expect(db.execute).toHaveBeenCalledWith(
        expect.any(String),
        expect.any(Array),
        expect.any(Function)
      );
    });

    test('should reject on database error', async () => {
      db.execute.mockImplementation((query, values, callback) => {
        callback(new Error('DB error'), null);
      });

      await expect(addTrainingComments(1, 'Test comment', 'User1', '2024-03-17 12:00:00'))
        .rejects.toThrow('DB error');
    });
  });
});
