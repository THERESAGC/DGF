const { getTotalFeedbacksTriggeredController } = require('../../controllers/feedbackTriggeredCountController');
const { getTotalFeedbacksTriggeredWithDates } = require('../../services/feedbackTriggeredCountService');

jest.mock('../../services/feedbackTriggeredCountService');

describe('getTotalFeedbacksTriggeredController', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  it('should return feedback triggered data with status 200', async () => {
    const mockData = [{ date: '2024-04-01', count: 10 }];
    getTotalFeedbacksTriggeredWithDates.mockResolvedValue(mockData);

    await getTotalFeedbacksTriggeredController(req, res);

    expect(getTotalFeedbacksTriggeredWithDates).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  it('should return status 500 on error', async () => {
    getTotalFeedbacksTriggeredWithDates.mockRejectedValue(new Error('Database error'));

    await getTotalFeedbacksTriggeredController(req, res);

    expect(getTotalFeedbacksTriggeredWithDates).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch total feedbacks triggered' });
  });
});
