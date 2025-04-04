const request = require('supertest');
const express = require('express');
const { fetchEmailReminders, sendReminder } = require('../../controllers/emailReminderController');
const { getEmailReminders, sendReminderEmailAndUpdate } = require('../../services/emailReminderService');

jest.mock('../../services/emailReminderService');

const app = express();
app.use(express.json());
app.get('/fetch-email-reminders', fetchEmailReminders);
app.post('/send-reminder', sendReminder);

describe('Email Reminder Controller', () => {
    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); 
    });

    describe('fetchEmailReminders', () => {
        it('should return reminders successfully', async () => {
            const mockReminders = [{ id: 1, message: 'Reminder 1' }];
            getEmailReminders.mockResolvedValue(mockReminders);

            const response = await request(app).get('/fetch-email-reminders?emp_id=101&role_id=2');
            
            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockReminders);
        });

        it('should return 400 if emp_id or role_id is missing', async () => {
            const response = await request(app).get('/fetch-email-reminders?emp_id=101');
            
            expect(response.status).toBe(400);
            expect(response.body).toEqual({ error: 'emp_id and role_id are required' });
        });

        it('should return 500 on service failure', async () => {
            getEmailReminders.mockRejectedValue(new Error('Service failure'));

            const response = await request(app).get('/fetch-email-reminders?emp_id=101&role_id=2');
            
            expect(response.status).toBe(500);
            expect(response.body).toEqual({ error: 'Failed to fetch reminders' });
        });
    });

    describe('sendReminder', () => {
        it('should send reminder successfully', async () => {
            sendReminderEmailAndUpdate.mockResolvedValue({ success: true });

            const response = await request(app)
                .post('/send-reminder')
                .send({ learningInitiatedAssignments: [1, 2, 3], empId: '101' });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({ success: true });
        });

        it('should return 500 on service failure', async () => {
            sendReminderEmailAndUpdate.mockRejectedValue(new Error('Email service failure'));

            const response = await request(app)
                .post('/send-reminder')
                .send({ learningInitiatedAssignments: [1, 2, 3], empId: '101' });

            expect(response.status).toBe(500);
            expect(response.body).toEqual({ message: 'Failed to send email reminders', error: 'Email service failure' });
        });
    });
});
