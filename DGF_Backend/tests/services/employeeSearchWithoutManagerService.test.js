const { searchEmployeesByNameWithoutManager } = require('../../services/employeeSearchWithoutManagerService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('searchEmployeesByNameWithoutManager Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return employees matching the name prefix', async () => {
    const mockResult = [
      { emp_id: 1, emp_name: 'Alice Johnson', emp_email: 'alice.johnson@example.com', profile_image: 'alice.jpg' },
      { emp_id: 2, emp_name: 'Alicia Brown', emp_email: 'alicia.brown@example.com', profile_image: 'alicia.jpg' },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await searchEmployeesByNameWithoutManager('Ali');

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), ['Ali%'], expect.any(Function));
  });

  test('should return an empty array if no employees match', async () => {
    const mockResult = [];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResult);
    });

    const result = await searchEmployeesByNameWithoutManager('Unknown');

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), ['Unknown%'], expect.any(Function));
  });

  test('should throw an error if database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(searchEmployeesByNameWithoutManager('Ali')).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), ['Ali%'], expect.any(Function));
  });
});
