const { handleStatusUpdate } = require('../../controllers/courseStatusController');
const courseStatusService = require('../../services/courseStatusService');

jest.mock('../../services/courseStatusService'); 

describe('Course Status Controller', () => {
    let req, res;

    beforeEach(() => {
        req = {
            params: { assignmentId: '123' },
            body: { status: 'Completed' }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    });
      
    test('should return 400 if assignmentId or status is missing', async () => {
        req.params.assignmentId = null;

        await handleStatusUpdate(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
       
    });

    test('should return 200 with update result if service succeeds', async () => {
        const mockResult = { success: true, message: 'Status updated successfully' };
        courseStatusService.updateCourseStatus.mockResolvedValue(mockResult);

        await handleStatusUpdate(req, res);

        expect(res.json).toHaveBeenCalledWith(mockResult);
        expect(res.status).not.toHaveBeenCalledWith(500);
    });

    test('should return 400 if service throws an invalid status error', async () => {
        courseStatusService.updateCourseStatus.mockRejectedValue(new Error('Invalid status: NotAllowed'));

        await handleStatusUpdate(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
    });

    test('should return 500 if service throws a general error', async () => {
        process.env.NODE_ENV = 'development'; // Set NODE_ENV to development
    
        courseStatusService.updateCourseStatus.mockRejectedValue(new Error('Database error'));
    
        await handleStatusUpdate(req, res);
    
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
            error: 'Database error',
            details: expect.any(String) // Ensures stack trace is included
        }));
    
        process.env.NODE_ENV = 'test'; // Reset to original state after test
    });
    
});
