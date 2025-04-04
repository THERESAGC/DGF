const { getAssignedCoursesByEmployeeHandler } = require('../../controllers/getAssignedCoursesByEmployeeController');
const { getAssignedCoursesByEmployee } = require('../../services/getAssignedCoursesByEmployeeService');

jest.mock('../../services/getAssignedCoursesByEmployeeService');

describe('getAssignedCoursesByEmployeeHandler', () => {
    let req, res;

    beforeEach(() => {
        req = { params: { emp_id: '123' } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); 
    });

    test('should return 400 if emp_id is missing', async () => {
        req.params = {}; // No emp_id
        
        await getAssignedCoursesByEmployeeHandler(req, res);
        
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'emp_id is a required parameter' });
    });

    test('should return 404 if no courses are found', async () => {
        getAssignedCoursesByEmployee.mockResolvedValue([]);
        
        await getAssignedCoursesByEmployeeHandler(req, res);
        
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'No courses found for this employee' });
    });

    test('should return 200 and assigned courses when data is found', async () => {
        const mockCourses = [{ id: 1, name: 'JavaScript Basics' }];
        getAssignedCoursesByEmployee.mockResolvedValue(mockCourses);
        
        await getAssignedCoursesByEmployeeHandler(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ data: mockCourses });
    });

    test('should return 500 if service throws an error', async () => {
        getAssignedCoursesByEmployee.mockRejectedValue(new Error('Database Error'));
        
        await getAssignedCoursesByEmployeeHandler(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal Server Error', error: 'Database Error' });
    });
});
