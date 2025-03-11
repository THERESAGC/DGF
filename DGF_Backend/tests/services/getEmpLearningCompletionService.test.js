const { getEmployeeCompletionStatus } = require('../../services/getEmpLearningCompletionService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getEmployeeCompletionStatus Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return employee completion status successfully', async () => {
    const mockResults = [
      {
        totalEmployees: 10,
        completedEmployees: 7,
      },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getEmployeeCompletionStatus(123);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [123], expect.any(Function));
  });

  test('should return zero counts when no employees exist', async () => {
    const mockResults = [
      {
        totalEmployees: 0,
        completedEmployees: 0,
      },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getEmployeeCompletionStatus(123);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if the database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getEmployeeCompletionStatus(123)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
