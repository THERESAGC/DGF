const { getAssignedCoursesByEmployeeAndRequest } = require('../../services/getassignedCoursesService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getAssignedCoursesByEmployeeAndRequest Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch assigned courses for a given employee and request ID successfully', async () => {
    const mockResults = [
      {
        assignment_id: 1,
        requestid: 101,
        employee_id: 1001,
        employee_name: 'John Doe',
        mentor_id: 2001,
        mentor_name: 'Jane Smith',
        course_id: 3001,
        course_name: 'JavaScript Basics',
        coursetype_id: 4001,
        coursetype_name: 'Technical',
        completion_date: '2025-01-01',
        comments: 'Good progress',
        assigned_date: '2024-12-01',
        learning_type: 'Online',
        progress: 80,
        status: 'In Progress',
      },
    ];

    db.execute.mockImplementation((query, params, callback) => {
      callback(null, mockResults);
    });

    const result = await getAssignedCoursesByEmployeeAndRequest(1001, 101);

    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [1001, 101], expect.any(Function));
  });

  test('should return an empty array if no assigned courses are found', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(null, []);
    });

    const result = await getAssignedCoursesByEmployeeAndRequest(1001, 101);

    expect(result).toEqual([]);
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error if the database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getAssignedCoursesByEmployeeAndRequest(1001, 101)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });
});
