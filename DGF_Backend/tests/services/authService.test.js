const { authenticateUser } = require('../../services/authService');
const User = require('../../models/User');

jest.mock('../../models/User', () => ({
  findByEmail: jest.fn(),
}));

describe('authenticateUser', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return "Database error" if there is an error retrieving user', (done) => {
    User.findByEmail.mockImplementation((email, callback) => callback(new Error('DB error'), null));

    authenticateUser('test@example.com', 'password123', (err, user) => {
      expect(err).toBe('Database error');
      expect(user).toBeNull();
      done();
    });
  });

  test('should return "User not found" if no user exists for given email', (done) => {
    User.findByEmail.mockImplementation((email, callback) => callback(null, []));

    authenticateUser('notfound@example.com', 'password123', (err, user) => {
      expect(err).toBe('User not found');
      expect(user).toBeNull();
      done();
    });
  });
  
  test('should return "User not found" if user is not active', (done) => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'correctPassword', status: 'inactive' };
    User.findByEmail.mockImplementation((email, callback) => callback(null, [mockUser]));

    authenticateUser('test@example.com', 'correctPassword', (err, user) => {
      expect(err).toBe('User not found');
      expect(user).toBeNull();
      done();
    });
  });

  test('should return "Incorrect password" if password does not match', (done) => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'correctPassword',  status: 'active' };
    User.findByEmail.mockImplementation((email, callback) => callback(null, [mockUser]));

    authenticateUser('test@example.com', 'wrongPassword', (err, user) => {
      expect(err).toBe('Incorrect password');
      expect(user).toBeNull();
      done();
    });
  });

  test('should return user object if authentication is successful', (done) => {
    const mockUser = { id: 1, email: 'test@example.com', password: 'correctPassword', status: 'active' };
    User.findByEmail.mockImplementation((email, callback) => callback(null, [mockUser]));

    authenticateUser('test@example.com', 'correctPassword', (err, user) => {
      expect(err).toBeNull();
      expect(user).toEqual(mockUser);
      done();
    });
  });
});
