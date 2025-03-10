const { insertMultipleEmpNewTrainingRequested } = require('../../services/empNewTrainingRequestedService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('insertMultipleEmpNewTrainingRequested Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should insert multiple employee training requests successfully', async () => {
    const employees = [
      { emp_id: 1, availablefrom: '2025-03-01', dailyband: 'Morning', availableonweekend: true, requestid: 101 },
      { emp_id: 2, availablefrom: '2025-03-02', dailyband: 'Evening', availableonweekend: false, requestid: 102 },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const result = await insertMultipleEmpNewTrainingRequested(employees);

    expect(result).toHaveLength(2);
    expect(db.execute).toHaveBeenCalledTimes(2);
  });

  test('should throw an error if any query fails', async () => {
    const employees = [
      { emp_id: 1, availablefrom: '2025-03-01', dailyband: 'Morning', availableonweekend: true, requestid: 101 },
      { emp_id: 2, availablefrom: '2025-03-02', dailyband: 'Evening', availableonweekend: false, requestid: 102 },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(insertMultipleEmpNewTrainingRequested(employees)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(2);
  });

  test('should handle an empty employee list', async () => {
    const employees = [];

    const result = await insertMultipleEmpNewTrainingRequested(employees);

    expect(result).toEqual([]);
    expect(db.execute).not.toHaveBeenCalled();
  });
});
