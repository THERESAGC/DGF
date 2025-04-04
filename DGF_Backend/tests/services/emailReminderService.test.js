const db = require('../../config/db');
const { sendEmail } = require('../../services/mailService');
const { getEmailReminders, sendReminderEmailAndUpdate } = require('../../services/emailReminderService');

jest.mock('../../config/db', () => ({
  promise: jest.fn().mockReturnValue({
    execute: jest.fn(),
    getConnection: jest.fn(),
  }),
}));

jest.mock('../../services/mailService', () => ({
  sendEmail: jest.fn(),
}));

describe('emailReminderService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); 
  });

  describe('getEmailReminders', () => {
    it('should fetch email reminders for an admin', async () => {
      const mockResults = [{ emailreminder_id: 1, assignment_id: 101 }];
      db.promise().execute.mockResolvedValue([mockResults]);

      const result = await getEmailReminders(123, 4);

      expect(db.promise().execute).toHaveBeenCalledWith(expect.stringContaining('ORDER BY er.last_reminder_date DESC'), []);
      expect(result).toEqual(mockResults);
    });

    it('should fetch email reminders for a non-admin', async () => {
      const mockResults = [{ emailreminder_id: 2, assignment_id: 102 }];
      db.promise().execute.mockResolvedValue([mockResults]);

      const result = await getEmailReminders(123, 3);

      expect(db.promise().execute).toHaveBeenCalledWith(expect.stringContaining('WHERE ntr.requestedbyid = ?'), [123]);
      expect(result).toEqual(mockResults);
    });

    it('should throw an error if query fails', async () => {
      db.promise().execute.mockRejectedValue(new Error('DB error'));

      await expect(getEmailReminders(123, 3)).rejects.toThrow('Failed to fetch email reminders');
    });
  });

  describe('sendReminderEmailAndUpdate', () => {
    let mockConnection;
    beforeEach(() => {
        mockConnection = {
            execute: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn(),
        };
        db.promise().getConnection.mockResolvedValue(mockConnection);
    });

    it('should send reminder email and update the database when record exists', async () => {
        mockConnection.execute
            .mockResolvedValueOnce([[{ emp_email: 'test@example.com', requestid: 5 }]]) // Fetch employee email
            .mockResolvedValueOnce([[{ emailreminder_id: 1 }]]) // Record exists
            .mockResolvedValueOnce(); // Update record
        sendEmail.mockResolvedValue();

        const result = await sendReminderEmailAndUpdate([101], 123);

        expect(sendEmail).toHaveBeenCalledWith(
            'test@example.com',
            expect.any(String),
            expect.any(String),
            expect.any(String),
            expect.any(String)
        );
        expect(mockConnection.execute).toHaveBeenCalledWith(
            expect.stringContaining('UPDATE email_reminders'),
            [101]
        );
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Emails sent and reminders updated successfully.' });
    });

    it('should insert a new record when no existing reminder found', async () => {
        mockConnection.execute
            .mockResolvedValueOnce([[{ emp_email: 'test@example.com', requestid: 5 }]]) // Employee exists
            .mockResolvedValueOnce([[]]) // No existing reminder
            .mockResolvedValueOnce(); // Insert operation
    
        sendEmail.mockResolvedValue();
    
        const result = await sendReminderEmailAndUpdate([101], 123);
    
        expect(sendEmail).toHaveBeenCalled();
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(result).toEqual({ message: 'Emails sent and reminders updated successfully.' });
    });

    it('should throw an error if no employee is found', async () => {
        mockConnection.execute.mockResolvedValueOnce([[]]); // Ensure it returns an empty array
    
        await expect(sendReminderEmailAndUpdate([103], 123)).rejects.toThrow(
            'Employee not found for assignment_id: 103'
        );
        expect(mockConnection.rollback).toHaveBeenCalled();
    });
    
    it('should rollback transaction on error', async () => {
        mockConnection.execute.mockRejectedValue(new Error('DB error'));

        await expect(sendReminderEmailAndUpdate([104], 123)).rejects.toThrow('DB error');
        expect(mockConnection.rollback).toHaveBeenCalled();
    });

    it('should rollback transaction if email sending fails', async () => {
        mockConnection.execute.mockResolvedValueOnce([[{ emp_email: 'test@example.com', requestid: 5 }]]);
        sendEmail.mockRejectedValue(new Error('Email service failure'));

        await expect(sendReminderEmailAndUpdate([105], 123)).rejects.toThrow('Email service failure');
        expect(mockConnection.rollback).toHaveBeenCalled();
    });
});

});
