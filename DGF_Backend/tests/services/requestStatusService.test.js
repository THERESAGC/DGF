const { updateRequestStatus } = require('../../services/requestStatusService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Request Service - updateRequestStatus', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test.each([
    [10, 'approve', 'spoc approved'],
    [5, 'approve', 'capdev approved'],
    [8, 'reject', 'rejected'],
    [7, 'hold', 'request suspended'],
    [3, 'needClarification', 'clarification requested'],
  ])('should update request status correctly for roleId=%i, status=%s', async (roleId, status, expectedStatus) => {
    const requestId = 123;
    const approverId = 456;
    const mockResults = { affectedRows: 1 };

    db.execute.mockImplementationOnce((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await updateRequestStatus(requestId, status, roleId, approverId);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(
      expect.any(String),
      [expectedStatus, approverId, requestId],
      expect.any(Function)
    );
  });

  test('should reject with an error for an invalid status', async () => {
    const requestId = 123;
    const roleId = 10;
    const approverId = 456;
    const invalidStatus = 'invalidStatus';

    await expect(updateRequestStatus(requestId, invalidStatus, roleId, approverId)).rejects.toThrow('Invalid status');
    expect(db.execute).not.toHaveBeenCalled();
  });

  test('should handle database errors', async () => {
    const requestId = 123;
    const status = 'approve';
    const roleId = 10;
    const approverId = 456;

    db.execute.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(updateRequestStatus(requestId, status, roleId, approverId)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
