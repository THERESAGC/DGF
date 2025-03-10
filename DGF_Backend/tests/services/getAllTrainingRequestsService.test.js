const { getAllTrainingRequests } = require('../../services/getAllTrainingRequestsService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));

describe('getAllTrainingRequests Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all training requests successfully', async () => {
    const mockResults = [
      {
        requestid: 1,
        source: 101,
        source_name: 'Internal',
        trainingobj: 201,
        trainingobj_name: 'Java Training',
        requestedbyid_name: 'John Doe',
      },
      {
        requestid: 2,
        source: 102,
        source_name: 'External',
        trainingobj: 202,
        trainingobj_name: 'React Training',
        requestedbyid_name: 'Jane Smith',
      },
    ];

    db.query.mockImplementation((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getAllTrainingRequests();

    expect(result).toEqual(mockResults);
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if query fails', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getAllTrainingRequests()).rejects.toThrow('Database error');
    expect(db.query).toHaveBeenCalledTimes(1);
  });

  test('should return an empty array if no training requests are found', async () => {
    db.query.mockImplementation((query, callback) => {
      callback(null, []);
    });

    const result = await getAllTrainingRequests();

    expect(result).toEqual([]);
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});
