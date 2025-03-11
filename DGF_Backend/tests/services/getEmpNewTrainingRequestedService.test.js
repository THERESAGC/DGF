const { getEmpNewTrainingRequestedByRequestId } = require('../../services/getEmpNewTrainingRequestedService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getEmpNewTrainingRequestedByRequestId Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return employee training request details successfully', async () => {
    const mockResults = [
      {
        emp_id: 101,
        emp_name: 'John Doe',
        availablefrom: '2025-03-01',
        dailyband: 'Morning',
        availableonweekend: 'Yes',
        requestid: 123,
        emailsentstatus: 'Sent',
        emailsentdate: '2025-03-05',
        comment: 'Training approved',
        status: 'Pending',
        createddate: '2025-02-28',
        courses_assigned: 3,
        profile_image: 'john_doe.jpg',
      },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getEmpNewTrainingRequestedByRequestId(123);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [123], expect.any(Function));
  });

  test('should return an empty array when no records match the request ID', async () => {
    const mockResults = [];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getEmpNewTrainingRequestedByRequestId(999); // Assuming 999 has no matching records

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if the database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getEmpNewTrainingRequestedByRequestId(123)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
