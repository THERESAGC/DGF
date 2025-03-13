const { getTrainingObjectivesBySource } = require('../../services/trainingObjectivesService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Training Service - getTrainingObjectivesBySource', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return training objectives for a valid source_id', async () => {
    const mockResults = [
      { training_id: 1, training_name: 'Leadership Training' },
      { training_id: 2, training_name: 'Technical Training' },
    ];

    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getTrainingObjectivesBySource(1);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
  });

  test('should return an empty array if no training objectives are found', async () => {
    const mockResults = [];

    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getTrainingObjectivesBySource(2);

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [2], expect.any(Function));
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getTrainingObjectivesBySource(3)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
