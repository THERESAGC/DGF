const { getEmployeeById, setAssignedTobyId } = require('../../services/getsetEmpBasedOnIdService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  query: jest.fn(),
  execute: jest.fn(),
}));

describe('getsetEmpBasedOnIdService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe('getEmployeeById', () => {
    test('should return employee details when emp_id is found', async () => {
      const mockResults = [{ name: 'John Doe' }];
      
      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      const result = await getEmployeeById(1);

      expect(result).toEqual(mockResults);
      expect(db.query).toHaveBeenCalledTimes(1);
      expect(db.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
    });

    test('should return an empty array when emp_id is not found', async () => {
      const mockResults = [];

      db.query.mockImplementation((query, params, callback) => {
        callback(null, mockResults);
      });

      const result = await getEmployeeById(999);

      expect(result).toEqual([]);
      expect(db.query).toHaveBeenCalledTimes(1);
    });

    test('should throw an error when database query fails', async () => {
      db.query.mockImplementation((query, params, callback) => {
        callback(new Error('Database error'), null);
      });

      await expect(getEmployeeById(1)).rejects.toThrow('Database error');
      expect(db.query).toHaveBeenCalledTimes(1);
    });
  });

  describe('setAssignedTobyId', () => {
    test('should successfully update AssignedTo field', async () => {
      const mockResult = { affectedRows: 1 };

      db.execute.mockImplementation((query, params, callback) => {
        callback(null, mockResult);
      });

      const result = await setAssignedTobyId(101, 5);

      expect(result).toEqual(mockResult);
      expect(db.execute).toHaveBeenCalledTimes(1);
      expect(db.execute).toHaveBeenCalledWith(expect.any(String), [5, 101], expect.any(Function));
    });

    test('should throw an error when database update fails', async () => {
      db.execute.mockImplementation((query, params, callback) => {
        callback(new Error('Update failed'), null);
      });

      await expect(setAssignedTobyId(101, 5)).rejects.toThrow('Update failed');
      expect(db.execute).toHaveBeenCalledTimes(1);
    });
  });
});
