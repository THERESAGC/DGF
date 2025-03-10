const { deleteEmployeeFromTrainingRequest } = require('../../services/empDeleteTrainingRequestedService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('deleteEmployeeFromTrainingRequest Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully delete an employee from a training request', async () => {
    const mockResult = { affectedRows: 1 };

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await deleteEmployeeFromTrainingRequest(101, 202);

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([101, 202]),
      expect.any(Function)
    );
  });

  test('should return affectedRows as 0 when no matching record is found', async () => {
    const mockResult = { affectedRows: 0 };

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await deleteEmployeeFromTrainingRequest(999, 888); // Assuming these IDs don't exist

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([999, 888]),
      expect.any(Function)
    );
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(deleteEmployeeFromTrainingRequest(101, 202)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([101, 202]),
      expect.any(Function)
    );
  });
});
