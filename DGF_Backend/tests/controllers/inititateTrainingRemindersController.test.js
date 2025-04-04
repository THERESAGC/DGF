const request = require('supertest');
const express = require('express');
const remindersController = require('../../controllers/inititateTrainingRemindersController');
const remindersService = require('../../services/inititateTrainingRemindersService');

jest.mock('../../services/inititateTrainingRemindersService');

const app = express();
app.use(express.json());
app.post('/reminders', remindersController.createReminder);
app.delete('/reminders/:reminder_id', remindersController.deleteReminder);
app.get('/reminders/by-assignment', remindersController.getRemindersByDateandByAssignmentId);
app.get('/reminders/by-employee', remindersController.getRemindersByDateandByEmpId);

describe('Training Reminders Controller', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test('should create a reminder successfully', async () => {
        remindersService.createReminder.mockResolvedValue();
        
        const response = await request(app)
            .post('/reminders')
            .send({ title: 'Test Reminder' });
        
        expect(response.status).toBe(201);
        expect(response.body).toEqual({ message: 'Reminder created successfully' });
        expect(remindersService.createReminder).toHaveBeenCalledWith({ title: 'Test Reminder' });
    });

    test('should return 500 on createReminder error', async () => {
        remindersService.createReminder.mockRejectedValue(new Error('Database error'));
        
        const response = await request(app)
            .post('/reminders')
            .send({ title: 'Test Reminder' });
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Database error' });
    });

    test('should delete a reminder successfully', async () => {
        remindersService.deleteReminder.mockResolvedValue();
        
        const response = await request(app).delete('/reminders/123');
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'Reminder deleted successfully' });
        expect(remindersService.deleteReminder).toHaveBeenCalledWith('123');
    });

    test('should return 500 on deleteReminder error', async () => {
        remindersService.deleteReminder.mockRejectedValue(new Error('Delete error'));
        
        const response = await request(app).delete('/reminders/123');
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Delete error' });
    });

    test('should retrieve reminders by assignment ID', async () => {
        const mockReminders = [{ id: 1, message: 'Test' }];
        remindersService.getRemindersByDateandByAssignmentId.mockResolvedValue(mockReminders);
        
        const response = await request(app).get('/reminders/by-assignment').query({ assignment_id: '101' });
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockReminders);
        expect(remindersService.getRemindersByDateandByAssignmentId).toHaveBeenCalledWith('101');
    });

    test('should return 500 on getRemindersByDateandByAssignmentId error', async () => {
        remindersService.getRemindersByDateandByAssignmentId.mockRejectedValue(new Error('Fetch error'));
        
        const response = await request(app).get('/reminders/by-assignment').query({ assignment_id: '101' });
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Fetch error' });
    });

    test('should retrieve reminders by employee ID', async () => {
        const mockReminders = [{ id: 2, message: 'Employee Reminder' }];
        remindersService.getRemindersByDateandByEmpId.mockResolvedValue(mockReminders);
        
        const response = await request(app).get('/reminders/by-employee').query({ emp_id: '202' });
        
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockReminders);
        expect(remindersService.getRemindersByDateandByEmpId).toHaveBeenCalledWith('202');
    });

    test('should return 500 on getRemindersByDateandByEmpId error', async () => {
        remindersService.getRemindersByDateandByEmpId.mockRejectedValue(new Error('Service error'));
        
        const response = await request(app).get('/reminders/by-employee').query({ emp_id: '202' });
        
        expect(response.status).toBe(500);
        expect(response.body).toEqual({ error: 'Service error' });
    });
});