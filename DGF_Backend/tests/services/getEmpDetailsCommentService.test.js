const { getEmpbasedOnId } = require('../../services/getEmpDetailsCommentService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getEmpbasedOnId Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch employee details successfully for a given emp_id', async () => {
    const mockResults = [
      {
        emp_name: 'John Doe',
        profile_image: 'john_doe.jpg',
      },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getEmpbasedOnId(1001);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1001], expect.any(Function));
  });

  test('should return an empty array if no employee is found', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(null, []);
    });

    const result = await getEmpbasedOnId(1001);

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if the database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getEmpbasedOnId(1001)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
