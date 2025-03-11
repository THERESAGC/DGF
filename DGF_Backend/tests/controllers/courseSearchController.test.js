const { searchCourses } = require('../../controllers/courseSearchController');
const courseSearchService = require('../../services/courseSearchService');

jest.mock('../../services/courseSearchService'); 

describe('Course Search Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            query: { query: 'JavaScript' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    test('should return 400 if search query is missing', async () => {
        req.query = {}; 

        await searchCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: 'Search query is required' });
    });

    test('should return 200 with search results if service succeeds', async () => {
        const mockResults = [
            { id: 1, name: 'JavaScript Basics' },
            { id: 2, name: 'Advanced JavaScript' }
        ];
        courseSearchService.searchCoursesByName.mockResolvedValue(mockResults);

        await searchCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    test('should return 500 if service throws an error', async () => {
        courseSearchService.searchCoursesByName.mockRejectedValue(new Error('Database error'));

        await searchCourses(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: 'An error occurred while searching courses',
            details: 'Database error'
        });
    });
});
