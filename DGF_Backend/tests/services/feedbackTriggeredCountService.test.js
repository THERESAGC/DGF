const db = require('../../config/db');
const { getTotalFeedbacksTriggeredWithDates } = require('../../services/feedbackTriggeredCountService');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('feedbackTriggeredCountService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return total feedbacks triggered grouped by date', async () => {
    const mockResults = [
      { total_feedbacks_triggered: 5, employee_email_sent_date: '2024-04-01' },
      { total_feedbacks_triggered: 3, employee_email_sent_date: '2024-04-02' },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const results = await getTotalFeedbacksTriggeredWithDates();
    expect(results).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  it('should throw an error if database query fails', async () => {
    const mockError = new Error('Database error');
    db.execute.mockImplementation((query, params, callback) => {
      callback(mockError, null);
    });

    await expect(getTotalFeedbacksTriggeredWithDates()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
