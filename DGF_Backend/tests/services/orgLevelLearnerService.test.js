const { getOrgLevelLearnerDataService } = require('../../services/orgLevelLearnerService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('Org Level Learner Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should fetch organization-level learner data successfully', async () => {
    const mockTotalRequests = [{ total_requests: 5 }];
    const mockTotalPrimarySkills = [{ total_primary_skills: 10 }];
    const mockResults = [
      {
        emp_id: 1,
        requestid: 101,
        status: 'In Progress',
        createddate: '2024-01-01',
        primary_skills_count: 3,
        primary_skills: 'Java, Python, SQL',
        tech_stacks: 'Spring, Django',
        training_objective: 'Advanced Training',
        requested_by: 'John Doe',
        project_name: 'Project Alpha'
      }
    ];

    db.execute
      .mockImplementationOnce((query, params, callback) => callback(null, mockTotalRequests))
      .mockImplementationOnce((query, params, callback) => callback(null, mockTotalPrimarySkills))
      .mockImplementationOnce((query, params, callback) => callback(null, mockResults));

    const result = await getOrgLevelLearnerDataService(1);
    
    expect(result).toEqual({
      total_requests: 5,
      total_primary_skills: 10,
      requests: mockResults
    });
    expect(db.execute).toHaveBeenCalledTimes(3);
  });

  test('should handle database error when fetching total requests', async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getOrgLevelLearnerDataService(1)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should handle database error when fetching total primary skills', async () => {
    db.execute
      .mockImplementationOnce((query, params, callback) => callback(null, [{ total_requests: 5 }]))
      .mockImplementationOnce((query, params, callback) => callback(new Error('Primary skills error'), null));

    await expect(getOrgLevelLearnerDataService(1)).rejects.toThrow('Primary skills error');
    expect(db.execute).toHaveBeenCalledTimes(2);
  });

  test('should handle database error when fetching request details', async () => {
    db.execute
      .mockImplementationOnce((query, params, callback) => callback(null, [{ total_requests: 5 }]))
      .mockImplementationOnce((query, params, callback) => callback(null, [{ total_primary_skills: 10 }]))
      .mockImplementationOnce((query, params, callback) => callback(new Error('Request details error'), null));

    await expect(getOrgLevelLearnerDataService(1)).rejects.toThrow('Request details error');
    expect(db.execute).toHaveBeenCalledTimes(3);
  });

  test('should return empty requests if no data is found', async () => {
    db.execute
      .mockImplementationOnce((query, params, callback) => callback(null, [{ total_requests: 0 }]))
      .mockImplementationOnce((query, params, callback) => callback(null, [{ total_primary_skills: 0 }]))
      .mockImplementationOnce((query, params, callback) => callback(null, []));

    const result = await getOrgLevelLearnerDataService(1);
    
    expect(result).toEqual({
      total_requests: 0,
      total_primary_skills: 0,
      requests: []
    });
    expect(db.execute).toHaveBeenCalledTimes(3);
  });
});
