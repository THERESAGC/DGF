const { getEmployeesByPartialEmail } = require('../../services/emailSearchWithoutManagerIdService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getEmployeesByPartialEmail Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve employees matching the partial email', async () => {
    const mockEmployees = [
      { emp_id: 1, emp_name: 'John Doe', emp_email: 'john@example.com', profile_image: 'john.jpg' },
      { emp_id: 2, emp_name: 'Jane Smith', emp_email: 'jane@example.com', profile_image: 'jane.jpg' },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockEmployees);
    });

    const result = await getEmployeesByPartialEmail('john');

    expect(result).toEqual(mockEmployees);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.arrayContaining(['%john%']), expect.any(Function));
  });

  test('should return an empty array if no employees match the search', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(null, []);
    });

    const result = await getEmployeesByPartialEmail('notfound');

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.arrayContaining(['%notfound%']), expect.any(Function));
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getEmployeesByPartialEmail('john')).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.arrayContaining(['%john%']), expect.any(Function));
  });
});
