const { getCourseTypes } = require('../../controllers/courseTypeController');
const courseTypeService = require('../../services/courseTypeService');

jest.mock('../../services/courseTypeService'); 

describe('Course Type Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {}; // No request parameters needed
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should return 200 with course types if service succeeds', async () => {
        const mockCourseTypes = [
            { id: 1, name: 'Online' },
            { id: 2, name: 'In-person' }
        ];
        courseTypeService.getAllCourseTypes.mockResolvedValue(mockCourseTypes);

        await getCourseTypes(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockCourseTypes);
    });

    test('should return 500 if service throws an error', async () => {
        courseTypeService.getAllCourseTypes.mockRejectedValue(new Error('Database error'));

        await getCourseTypes(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'An error occurred while fetching course types',
            details: 'Database error'
        });
    });
});
