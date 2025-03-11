const { searchEmployeesByName } = require('../../services/employeeSearchByNameService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('searchEmployeesByName Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return employees matching the manager ID and name prefix', async () => {
    const mockResult = [
      { emp_id: 1, emp_name: 'John Doe', emp_email: 'john.doe@example.com', profile_image: 'image1.jpg' },
      { emp_id: 2, emp_name: 'Johnny Smith', emp_email: 'johnny.smith@example.com', profile_image: 'image2.jpg' },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await searchEmployeesByName(101, 'John');

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [101, 'John%'], expect.any(Function));
  });

  test('should return an empty array if no employees match', async () => {
    const mockResult = [];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await searchEmployeesByName(101, 'Unknown');

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [101, 'Unknown%'], expect.any(Function));
  });

  test('should throw an error if database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(searchEmployeesByName(101, 'John')).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [101, 'John%'], expect.any(Function));
  });
});
