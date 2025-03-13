const { storePrimarySkills } = require('../../services/trainingRequestPrimarySkillService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));

describe('Training Request Primary Skill Service - storePrimarySkills', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should insert multiple primary skills successfully', async () => {
    const requestid = 2001;
    const primary_skill_ids = [10, 20, 30];

    const mockResults = { affectedRows: primary_skill_ids.length };

    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await storePrimarySkills(requestid, primary_skill_ids);

    expect(result).toEqual(mockResults);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO Request_Primary_Skills (requestid, primaryskill_id) VALUES ?',
      [[[2001, 10], [2001, 20], [2001, 30]]],
      expect.any(Function)
    );
  });

  test('should return an empty result when no primary skills are provided', async () => {
    const requestid = 2002;
    const primary_skill_ids = [];

    const mockResults = { affectedRows: 0 };

    db.query.mockImplementationOnce((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await storePrimarySkills(requestid, primary_skill_ids);

    expect(result).toEqual(mockResults);
    expect(db.query).toHaveBeenCalledWith(
      'INSERT INTO Request_Primary_Skills (requestid, primaryskill_id) VALUES ?',
      [[]],
      expect.any(Function)
    );
  });

  test('should handle database errors', async () => {
    const requestid = 2003;
    const primary_skill_ids = [40, 50];

    db.query.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(storePrimarySkills(requestid, primary_skill_ids)).rejects.toThrow('Database error');
    expect(db.query).toHaveBeenCalledTimes(1);
  });
});
