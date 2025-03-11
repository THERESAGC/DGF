const { login } = require('../../controllers/authController');
const authService = require('../../services/authService');

jest.mock('../../services/authService'); 

describe('Auth Controller - Login', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        email: 'test@example.com',
        password: 'securepassword'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should return 400 if email or password is missing', () => {
    req.body = {}; 

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: 'Email and password are required' });
  });

  test('should return 401 if authentication fails', () => {
    authService.authenticateUser.mockImplementation((email, password, callback) => {
      callback('Invalid credentials', null); 
    });

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'Invalid credentials' });
  });

  test('should return 200 if authentication succeeds', () => {
    const mockUser = { id: 1, email: 'test@example.com', name: 'Test User' };

    authService.authenticateUser.mockImplementation((email, password, callback) => {
      callback(null, mockUser); 
    });

    login(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: 'Login successful', user: mockUser });
  });
});
