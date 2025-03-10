const { getLoginDetails } = require('../../services/loginService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getLoginDetails', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return login details when database query succeeds', async () => {
    const mockLoginDetails = [
      {
        emp_id: 101,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'hashedpassword123',
        profile_image: 'profile.jpg',
        created_on: '2025-03-08',
        status: 'Active',
        role_name: 'Admin',
      },
    ];

    db.execute.mockImplementation((query, callback) => {
      callback(null, mockLoginDetails);
    });

    const result = await getLoginDetails();
    expect(result).toEqual(mockLoginDetails);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should return an empty array when no login details are found', async () => {
    db.execute.mockImplementation((query, callback) => {
      callback(null, []);
    });

    const result = await getLoginDetails();
    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error when the database query fails', async () => {
    db.execute.mockImplementation((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getLoginDetails()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
