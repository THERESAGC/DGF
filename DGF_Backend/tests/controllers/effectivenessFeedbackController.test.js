const request = require('supertest');
const express = require('express');
const { handleTaskCompletionRequest, getFeedbackDetails } = require('../../controllers/effectivenessFeedbackController');
const { handleTaskCompletion, getEmployeeName, getCourseName, getRequestedByUsingReqId } = require('../../services/effectivenessFeedbackService');

jest.mock('../../services/effectivenessFeedbackService');

const app = express();
app.use(express.json());
app.get('/feedback-details', getFeedbackDetails);
app.post('/task-completion/:assignment_id', handleTaskCompletionRequest);

describe('effectivenessFeedbackController', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    });

    describe('handleTaskCompletionRequest', () => {
        test('should return 200 if task completion is successful', async () => {
            handleTaskCompletion.mockResolvedValue();
            
            const res = await request(app).post('/task-completion/123');
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual({ message: 'Emails sent successfully' });
            expect(handleTaskCompletion).toHaveBeenCalledWith('123');
        });

        test('should return 500 if task completion fails', async () => {
            handleTaskCompletion.mockRejectedValue(new Error('Task completion error'));
            
            const res = await request(app).post('/task-completion/123');
            
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ message: 'Error handling task completion', error: {} });
        });
    });

    describe('getFeedbackDetails', () => {
        test('should return 400 if required query params are missing', async () => {
            const res = await request(app).get('/feedback-details');
            
            expect(res.status).toBe(400);
            expect(res.body).toEqual({ error: 'reqid, course_id, and employee_id are required' });
        });

        test('should return 200 with feedback details', async () => {
            getEmployeeName.mockResolvedValue('John Doe');
            getCourseName.mockResolvedValue('Software Testing');
            getRequestedByUsingReqId.mockResolvedValue('Manager Name');
            
            const res = await request(app).get('/feedback-details?reqid=1&course_id=101&employee_id=5001');
            
            expect(res.status).toBe(200);
            expect(res.body).toEqual({
                username: 'John Doe',
                course_name: 'Software Testing',
                requested_by: 'Manager Name'
            });
        });

        test('should return 500 if fetching feedback details fails', async () => {
            getEmployeeName.mockRejectedValue(new Error('Database error'));
            
            const res = await request(app).get('/feedback-details?reqid=1&course_id=101&employee_id=5001');
            
            expect(res.status).toBe(500);
            expect(res.body).toEqual({ error: 'Failed to fetch feedback details' });
        });
    });
});
