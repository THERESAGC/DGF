const request = require('supertest');
const { createAssignment } = require('../../controllers/assignCourseController');
const assignCourseService = require('../../services/assignCourseService');

jest.mock('../../services/assignCourseService'); 

describe('Assign Course Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        requestid: 1,
        employee_id: 101,
        mentor_id: 201,
        course_id: 301,
        coursetype_id: 401,
        completion_date: '2025-03-10',
        comments: 'Test assignment',
        learning_type: 'Online'
      }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  });

  test('should return 400 if required fields are missing', async () => {
    req.body = {}; 

    await createAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing required fields' });
  });

  test('should return 201 if course assignment is successful', async () => {
    const mockResult = {
      insertResult: { insertId: 123 },
      incrementResult: { affectedRows: 1 },
      updateEmpResult: 1,
      updateRequestResult: 1
    };

    assignCourseService.assignCourse.mockResolvedValue(mockResult);

    await createAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Course assigned and statuses updated successfully',
      assignmentId: 123,
      coursesAssigned: 1,
      employeeStatusUpdate: 1,
      requestStatusUpdate: 1
    });
  });

  test('should return 500 if service throws an error', async () => {
    assignCourseService.assignCourse.mockRejectedValue(new Error('Database error'));

    await createAssignment(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: 'An error occurred while assigning the course and updating statuses',
      details: 'Database error'
    });
  });
});
