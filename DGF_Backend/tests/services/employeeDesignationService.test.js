const { getEmployeesByDesignation } = require('../../services/employeeDesignationService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getEmployeesByDesignation Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test('should successfully return employees for given designation IDs', async () => {
    const mockResult = [
      { emp_id: 1, emp_name: 'John Doe', emp_email: 'john@example.com', profile_image: 'image1.jpg' },
      { emp_id: 2, emp_name: 'Jane Doe', emp_email: 'jane@example.com', profile_image: 'image2.jpg' },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await getEmployeesByDesignation([101, 102]);

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([101, 102]),
      expect.any(Function)
    );
  });

  test('should return an empty array when no employees match the given designation IDs', async () => {
    const mockResult = [];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await getEmployeesByDesignation([999]);

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([999]),
      expect.any(Function)
    );
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getEmployeesByDesignation([101])).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(
      expect.any(String),
      expect.arrayContaining([101]),
      expect.any(Function)
    );
  });
});
