const { getSourcesByRole } = require('../../services/roleService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Role Service - getSourcesByRole', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return sources for a valid role_id', async () => {
    const roleId = 5;
    const mockResults = [
      { source_id: 1, source_name: 'Source A' },
      { source_id: 2, source_name: 'Source B' },
    ];

    db.execute.mockImplementationOnce((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await getSourcesByRole(roleId);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [roleId], expect.any(Function));
  });

  test('should return an empty array if no sources are found', async () => {
    const roleId = 999; // Assume no sources assigned to this role
    const mockResults = [];

    db.execute.mockImplementationOnce((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await getSourcesByRole(roleId);

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [roleId], expect.any(Function));
  });

  test('should handle database errors', async () => {
    const roleId = 5;

    db.execute.mockImplementationOnce((query, values, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getSourcesByRole(roleId)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
