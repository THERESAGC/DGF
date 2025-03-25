const { getAllRoles } = require('../../controllers/getAllRolesController');
const rolesService = require('../../services/getAllRolesService');

jest.mock('../../services/getAllRolesService');

describe('Get All Roles Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
        jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console error logs
    });

    test('should return 200 and all roles if roles exist', async () => {
        const mockRoles = [
            { id: 1, name: 'Admin' },
            { id: 2, name: 'User' }
        ];
        rolesService.getAllRoles.mockResolvedValue(mockRoles);

        await getAllRoles(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockRoles);
    });

    test('should return 404 if no roles are found', async () => {
        rolesService.getAllRoles.mockResolvedValue([]);

        await getAllRoles(req, res);

        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No roles found.' });
    });

    test('should return 500 if an error occurs', async () => {
        rolesService.getAllRoles.mockRejectedValue(new Error('Database error'));

        await getAllRoles(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error' });
    });
});
