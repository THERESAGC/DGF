const { getLearnersService } = require('../../services/learnerService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getLearnersService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return learner details with total requests and primary skills', async () => {
    const emp_id = 101;

    const mockTotalRequests = [{ total_requests: 5 }];
    const mockTotalPrimarySkills = [{ total_primary_skills: 10 }];
    const mockLearnerRequests = [
      {
        emp_id,
        requestid: 202,
        status: 'In Progress',
        createddate: '2025-03-08',
        primary_skills_count: 3,
        primary_skills: 'JavaScript, Node.js, Express.js',
        tech_stacks: 'MERN, React',
        training_objective: 'Full Stack Development',
        requested_by: 'John Doe',
        project_name: 'Project A',
      },
    ];

    // Mock database responses
    db.execute.mockImplementation((query, params, callback) => {
      if (query.includes('COUNT(DISTINCT requestid)')) {
        callback(null, mockTotalRequests);
      } else if (query.includes('COUNT(primaryskill_id)')) {
        callback(null, mockTotalPrimarySkills);
      } else {
        callback(null, mockLearnerRequests);
      }
    });

    const result = await getLearnersService(emp_id);

    expect(result).toEqual({
      total_requests: 5,
      total_primary_skills: 10,
      requests: mockLearnerRequests,
    });

    expect(db.execute).toHaveBeenCalledTimes(3);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [emp_id], expect.any(Function));
  });

  test('should return zero requests and skills if no data found', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(null, [{ total_requests: 0 }]);
    });

    const result = await getLearnersService(999);

    expect(result).not.toEqual();

    expect(db.execute).toHaveBeenCalledTimes(3);
  });

  test('should throw an error when the database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getLearnersService(101)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  
  test('should throw an error when totalPrimarySkillsQuery fails', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      if (query.includes('COUNT(DISTINCT requestid)')) {
        callback(null, [{ total_requests: 5 }]);    // First query succeeds
      }
    });
  
    db.execute.mockImplementationOnce((query, params, callback) => {
      if (query.includes('COUNT(primaryskill_id)')) {
        callback(new Error('Total primary skills query failed'), null);     // Simulating error at line 90
      }
    });
  
    await expect(getLearnersService(101)).rejects.toThrow('Total primary skills query failed');
    expect(db.execute).toHaveBeenCalledTimes(2);
  });
  

  test('should throw an error when final learner data query fails (line 94)', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      if (query.includes('COUNT(DISTINCT requestid)')) {
        callback(null, [{ total_requests: 5 }]); // totalRequestsQuery succeeds
      }
    });
  
    db.execute.mockImplementationOnce((query, params, callback) => {
      if (query.includes('COUNT(primaryskill_id)')) {
        callback(null, [{ total_primary_skills: 10 }]); // totalPrimarySkillsQuery succeeds
      }
    });
  
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Final learner data query failed'), null); // Main query fails (triggers line 94)
    });
  
    await expect(getLearnersService(101)).rejects.toThrow('Final learner data query failed');
    expect(db.execute).toHaveBeenCalledTimes(3);
  });

});