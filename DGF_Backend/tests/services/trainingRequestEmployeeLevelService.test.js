const { storeEmployeeLevels } = require('../../services/trainingRequestEmployeeLevelService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));

describe('Training Request Employee Level Service - storeEmployeeLevels', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should insert multiple employee levels successfully', async () => {
    const requestid = 1001;
    const employee_level_ids = [1, 2, 3];

    const mockResults = { affectedRows: employee_level_ids.length };

    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await storeEmployeeLevels(requestid, employee_level_ids);

    expect(result).toEqual(mockResults);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO request_designations (requestid, Designation_Name) VALUES ?',
      [[[1001, 1], [1001, 2], [1001, 3]]],
      expect.any(Function)
    );
  });

  test('should return an empty result when no employee levels are provided', async () => {
    const requestid = 1002;
    const employee_level_ids = [];

    const mockResults = { affectedRows: 0 };

    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await storeEmployeeLevels(requestid, employee_level_ids);

    expect(result).toEqual(mockResults);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO request_designations (requestid, Designation_Name) VALUES ?',
      [[]],
      expect.any(Function)
    );
  });

  test('should handle database errors', async () => {
    const requestid = 1003;
    const employee_level_ids = [4, 5];

    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(storeEmployeeLevels(requestid, employee_level_ids)).rejects.toThrow('Database error');
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});
