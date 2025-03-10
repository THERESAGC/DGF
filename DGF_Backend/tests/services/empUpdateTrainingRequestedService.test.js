const { updateMultipleEmpNewTrainingRequested } = require('../../services/empUpdateTrainingRequestedService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('updateMultipleEmpNewTrainingRequested Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should update multiple employee training requests successfully', async () => {
    const employees = [
      { emp_id: 1, requestid: 101, availablefrom: '2025-03-10', dailyband: 'Morning', availableonweekend: true },
      { emp_id: 2, requestid: 102, availablefrom: '2025-03-11', dailyband: 'Evening', availableonweekend: false },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, { affectedRows: 1 });
    });

    const result = await updateMultipleEmpNewTrainingRequested(employees);

    expect(result).toHaveLength(2);
    expect(db.execute).toHaveBeenCalledTimes(2);
  });

  test('should throw an error if any query fails', async () => {
    const employees = [
      { emp_id: 1, requestid: 101, availablefrom: '2025-03-10', dailyband: 'Morning', availableonweekend: true },
      { emp_id: 2, requestid: 102, availablefrom: '2025-03-11', dailyband: 'Evening', availableonweekend: false },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(updateMultipleEmpNewTrainingRequested(employees)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(2);
  });

  test('should handle an empty employee list', async () => {
    const employees = [];

    const result = await updateMultipleEmpNewTrainingRequested(employees);

    expect(result).toEqual([]);
    expect(db.execute).not.toHaveBeenCalled();
  });
});
