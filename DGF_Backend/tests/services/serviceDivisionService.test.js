const { getAllServices } = require('../../services/serviceDivisionService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Service Division Service - getAllServices', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return all services', async () => {
    const mockResults = [
      { service_id: 1, service_name: 'Service A' },
      { service_id: 2, service_name: 'Service B' },
    ];

    db.execute.mockImplementationOnce((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getAllServices();

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should return an empty array if no services are found', async () => {
    const mockResults = [];

    db.execute.mockImplementationOnce((query, callback) => {
      callback(null, mockResults);
    });

    const result = await getAllServices();

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementationOnce((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getAllServices()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
