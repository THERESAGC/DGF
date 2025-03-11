const { getAllJobTitles } = require('../../services/employeeLevelService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getAllJobTitles Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should successfully return all job titles', async () => {
    const mockResult = [
      { id: 1, job_title: 'Software Engineer' },
      { id: 2, job_title: 'Project Manager' },
    ];

    db.execute.mockImplementation((query, callback) => {
      callback(null, mockResult);
    });

    const result = await getAllJobTitles();

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should return an empty array when no job titles are found', async () => {
    const mockResult = [];

    db.execute.mockImplementation((query, callback) => {
      callback(null, mockResult);
    });

    const result = await getAllJobTitles();

    expect(result).toEqual(mockResult);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementation((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getAllJobTitles()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });
});
