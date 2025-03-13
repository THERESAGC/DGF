const { getPrimarySkillsByStack } = require('../../services/primarySkillService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Primary Skill Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch primary skills by stack ID', async () => {
    const mockResults = [
      { skill_id: 1, skill_name: 'JavaScript' },
      { skill_id: 2, skill_name: 'Python' },
    ];
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getPrimarySkillsByStack(5);
    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [5], expect.any(Function));
  });

  test('should return an empty array if no primary skills are found', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, []);
    });

    const result = await getPrimarySkillsByStack(99);
    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [99], expect.any(Function));
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getPrimarySkillsByStack(3)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
