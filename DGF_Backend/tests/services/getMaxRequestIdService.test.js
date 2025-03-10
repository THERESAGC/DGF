const { getMaxRequestId } = require('../../services/getMaxRequestIdService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getMaxRequestId Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the next request ID when there are existing requests', async () => {
    const mockResults = [{ maxRequestId: 100 }];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getMaxRequestId();

    expect(result).toBe(101); // Expecting 100 + 1
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [], expect.any(Function));
  });

  test('should return 1 when there are no existing requests', async () => {
    const mockResults = [{ maxRequestId: null }]; // Simulating no records

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getMaxRequestId();

    expect(result).toBe(1); // Expecting 0 + 1
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if the database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getMaxRequestId()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
