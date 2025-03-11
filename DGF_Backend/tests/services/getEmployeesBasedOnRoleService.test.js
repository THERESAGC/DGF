const { getEmployeesBasedOnRole } = require('../../services/getEmployeesBasedOnRoleService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getEmployeesBasedOnRole Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return employees based on role successfully', async () => {
    const mockResults = [
      { emp_id: 1, name: 'John Doe' },
      { emp_id: 2, name: 'Jane Smith' },
    ];

    db.execute.mockImplementation((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getEmployeesBasedOnRole();

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should return an empty array if no employees exist', async () => {
    const mockResults = [];

    db.execute.mockImplementation((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getEmployeesBasedOnRole();

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if the database query fails', async () => {
    db.execute.mockImplementation((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getEmployeesBasedOnRole()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
