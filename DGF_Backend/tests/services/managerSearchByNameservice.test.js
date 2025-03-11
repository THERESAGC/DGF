const { searchManagersByName } = require('../../services/managerSearchByNameservice');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('searchManagersByName Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch managers matching the search name successfully', async () => {
    const mockResults = [
      {
        manager_id: 1,
        manager_name: 'Alice Johnson',
        manager_email: 'alice.johnson@example.com',
        role_id: 2,
      },
      {
        manager_id: 2,
        manager_name: 'Alice Smith',
        manager_email: 'alice.smith@example.com',
        role_id: 3,
      },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await searchManagersByName('Alice');

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), ['Alice%'], expect.any(Function));
  });

  test('should return an empty array if no managers match the search name', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(null, []);
    });

    const result = await searchManagersByName('Nonexistent');

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if the database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(searchManagersByName('Alice')).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
