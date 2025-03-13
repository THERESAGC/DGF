const { getAllTechStacks } = require('../../services/techstackService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Techstack Service - getAllTechStacks', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all tech stacks', async () => {
    const mockResults = [
      { stack_id: 1, stack_name: 'JavaScript' },
      { stack_id: 2, stack_name: 'Python' },
    ];

    db.execute.mockImplementationOnce((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getAllTechStacks();

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should return an empty array if no tech stacks are found', async () => {
    const mockResults = [];

    db.execute.mockImplementationOnce((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getAllTechStacks();

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementationOnce((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getAllTechStacks()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
