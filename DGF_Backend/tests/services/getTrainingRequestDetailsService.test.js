const { getTrainingRequestDetails } = require('../../services/getTrainingRequestDetailsService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getTrainingRequestDetailsService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return training request details with primary skills', async () => {
    const requestid = 101;
    const mockRequestDetails = [{
      requestid: requestid,
      source: 'Internal',
      trainingobj: 'JavaScript',
      requestonbehalfof: 'John Doe',
      requestedbyid: 5,
      requesttype: 'New Training',
      project: 'Project A',
      expecteddeadline: '2025-06-15',
      techstack: 'Node.js',
      otherskill: 'Express.js',
      suggestedcompletioncriteria: 'Certification',
      comments: 'Urgent',
      numberofpeople: 10,
      requestedby: 'Jane Smith',
      createddate: '2025-03-08',
      modifiedby: 'Admin',
      modifieddate: '2025-03-09',
      requeststatus: 'Approved',
      approvedby: 'Manager',
      service_division: 'Software',
      newprospectname: 'XYZ Corp',
      request_category: 'Technical',
      learningtype: 'Online',
      skilldevelopment: 'Advanced',
      assignedto: 'Trainer X'
    }];

    const mockPrimarySkills = [{ skill_name: 'React' }, { skill_name: 'Redux' }];

    // Mock database responses
    db.execute.mockImplementation((query, params, callback) => {
      if (query.includes('FROM newtrainingrequest')) {
        callback(null, mockRequestDetails);
      } else if (query.includes('FROM request_primary_skills')) {
        callback(null, mockPrimarySkills);
      }
    });

    const result = await getTrainingRequestDetails(requestid);

    expect(result).toEqual({
      ...mockRequestDetails[0],
      primarySkills: ['React', 'Redux'],
    });

    expect(db.execute).toHaveBeenCalledTimes(2);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), [requestid], expect.any(Function));
  });

  test('should return null if no training request found', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      if (query.includes('FROM newtrainingrequest')) {
        callback(null, []);
      }
    });

    const result = await getTrainingRequestDetails(999);

    expect(result).toBeNull();
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error when the initial database query fails', async () => {
    db.execute.mockImplementation((query, params, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getTrainingRequestDetails(101)).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledTimes(1);
  });

  test('should throw an error when querying primary skills fails', async () => {
    const requestid = 101;
    const mockRequestDetails = [{
      requestid: requestid,
      source: 'Internal',
      trainingobj: 'JavaScript',
      requestonbehalfof: 'John Doe',
      requestedbyid: 5,
      requesttype: 'New Training',
      project: 'Project A',
      expecteddeadline: '2025-06-15',
      techstack: 'Node.js',
      otherskill: 'Express.js',
      suggestedcompletioncriteria: 'Certification',
      comments: 'Urgent',
      numberofpeople: 10,
      requestedby: 'Jane Smith',
      createddate: '2025-03-08',
      modifiedby: 'Admin',
      modifieddate: '2025-03-09',
      requeststatus: 'Approved',
      approvedby: 'Manager',
      service_division: 'Software',
      newprospectname: 'XYZ Corp',
      request_category: 'Technical',
      learningtype: 'Online',
      skilldevelopment: 'Advanced',
      assignedto: 'Trainer X'
    }];

    // First query succeeds
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, mockRequestDetails);
    });

    // Second query (primary skills) fails
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error('Primary skills query failed'), null);
    });

    await expect(getTrainingRequestDetails(requestid)).rejects.toThrow('Primary skills query failed');
    expect(db.execute).toHaveBeenCalledTimes(2);
  });
});
