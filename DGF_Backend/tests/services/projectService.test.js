const { getAllProjects } = require('../../services/projectService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Project Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch all projects successfully', async () => {
    const mockResults = [
      { ProjectID: 1, ProjectName: 'Project Alpha' },
      { ProjectID: 2, ProjectName: 'Project Beta' },
    ];
    db.execute.mockImplementationOnce((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getAllProjects();
    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should return an empty array when no projects are found', async () => {
    db.execute.mockImplementationOnce((query, callback) => {
      callback(null, []);
    });

    const result = await getAllProjects();
    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should handle database error when fetching projects', async () => {
    db.execute.mockImplementationOnce((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getAllProjects()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
