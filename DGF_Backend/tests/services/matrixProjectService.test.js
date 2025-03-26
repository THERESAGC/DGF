const axios = require('axios');
const db = require('../../config/db');
const { getMatrixProjects } = require('../../services/matrixProjectService');

jest.mock('axios');
jest.mock('../../config/db', () => ({
    promise: jest.fn().mockReturnValue({
        execute: jest.fn()
    })
}));

describe('getMatrixProjects', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch data from the API and insert unique project names into the database', async () => {
        const mockData = [
            { projectlists: ['Project A', 'Project B'] },
            { projectlists: ['Project B', 'Project C'] }
        ];

        axios.get.mockResolvedValue({ data: mockData });
        db.promise().execute.mockResolvedValueOnce([[{ count: 0 }]]) // Mock check query for Project A
                             .mockResolvedValueOnce([[{ count: 0 }]]) // Mock check query for Project B
                             .mockResolvedValueOnce([[{ count: 0 }]]); // Mock check query for Project C

        await getMatrixProjects();

        expect(axios.get).toHaveBeenCalledTimes(1);
    });

    it('should handle API errors gracefully', async () => {
        axios.get.mockRejectedValue(new Error('API request failed'));

        await expect(getMatrixProjects()).resolves.not.toThrow();
    });

    it('should not insert duplicate project names', async () => {
        const mockData = [{ projectlists: ['Project A'] }];
        axios.get.mockResolvedValue({ data: mockData });
        db.promise().execute.mockResolvedValueOnce([[{ count: 1 }]]); // Project A already exists

        await getMatrixProjects();

        expect(db.promise().execute).toHaveBeenCalledWith(expect.stringContaining('SELECT COUNT(*)'), ['Project A']);
        expect(db.promise().execute).not.toHaveBeenCalledWith(expect.stringContaining('INSERT INTO projectname'), ['Project A', 2]);
    });

    it('should handle cases where projectlists is missing or not an array', async () => {
        const mockData = [
            { projectlists: null },
            { projectlists: 'invalid' },
            { someOtherField: 'No project list' }
        ];

        axios.get.mockResolvedValue({ data: mockData });

        await getMatrixProjects();

        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(db.promise().execute).not.toHaveBeenCalledWith(expect.stringContaining('INSERT INTO projectname'));
    });
});
