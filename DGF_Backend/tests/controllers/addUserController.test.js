const { addUserController } = require('../../controllers/addUserController');
const { addUser } = require('../../services/addUserService');

jest.mock('../../services/addUserService', () => ({
  addUser: jest.fn(),
}));

describe('addUserController', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test('should return 400 if required fields are missing', async () => {
    req.body = { emp_id: 1, name: 'John Doe', email: 'john@example.com' }; // Missing password & role_id

    await addUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  test('should return 201 if user is added successfully', async () => {
    req.body = {
      emp_id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securePass',
      role_id: 2,
      profile_image: null,
      created_on: '2025-03-10',
      status: 'active',
    };

    addUser.mockResolvedValue();
    await addUserController(req, res);

    expect(addUser).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ message: 'User added successfully' });
  });

  test('should return 500 if addUser throws an error', async () => {
    req.body = {
      emp_id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      password: 'securePass',
      role_id: 2,
    };

    const error = new Error('Database error');
    addUser.mockRejectedValue(error);
    await addUserController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'An error occurred while adding the user', details: error.message });
  });
});
