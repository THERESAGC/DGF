const { searchEmployeesByManagerIdAndEmail } = require('../../services/employeeSearchByEmailService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('searchEmployeesByManagerIdAndEmail Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return employees matching the manager ID and email prefix', async () => {
    const mockResult = [
      { emp_id: 1, emp_name: 'John Doe', emp_email: 'john.doe@example.com', profile_image: 'image1.jpg' },
      { emp_id: 2, emp_name: 'Jane Smith', emp_email: 'jane.smith@example.com', profile_image: 'image2.jpg' },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await searchEmployeesByManagerIdAndEmail(101, 'john');

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [101, 'john%'], expect.any(Function));
  });

  test('should return an empty array if no employees match', async () => {
    const mockResult = [];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await searchEmployeesByManagerIdAndEmail(101, 'unknown');

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [101, 'unknown%'], expect.any(Function));
  });

  test('should throw an error if database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(searchEmployeesByManagerIdAndEmail(101, 'john')).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [101, 'john%'], expect.any(Function));
  });
});
