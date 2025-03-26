const axios = require('axios');
const pool = require('../../config/db');
const { syncEmployees } = require('../../services/storeEmployeeService');

jest.mock('axios');
jest.mock('../../config/db', () => ({
    promise: jest.fn().mockReturnValue({
        getConnection: jest.fn().mockResolvedValue({
            query: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn()
        })
    })
}));

describe('syncEmployees', () => {
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            query: jest.fn(),
            beginTransaction: jest.fn(),
            commit: jest.fn(),
            rollback: jest.fn(),
            release: jest.fn()
        };
        pool.promise().getConnection.mockResolvedValue(mockConnection);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should successfully sync employees', async () => {
        const mockMatrixData = [
            { emp_email_id: 'test1@example.com', emp_empl_status: 'Active' },
            { emp_email_id: 'test2@example.com', emp_empl_status: 'Exited' }
        ];

        const mockAcademyData = [
            { employee_id: 'E001', firstname: 'John', lastname: 'Doe', email: 'test1@example.com', profilepic: 'pic1.jpg', designation_name: 'Engineer' },
            { employee_id: 'E002', firstname: 'Jane', lastname: 'Smith', email: 'test2@example.com', profilepic: 'pic2.jpg', designation_name: 'Manager' }
        ];

        axios.get.mockResolvedValueOnce({ status: 200, data: mockMatrixData }); // Matrix API
        axios.get.mockResolvedValueOnce({ status: 200, data: mockAcademyData }); // Academy API

        await syncEmployees();

        expect(mockConnection.beginTransaction).toHaveBeenCalled();
        expect(mockConnection.query).toHaveBeenCalledWith(
            expect.stringContaining('INSERT INTO employee'),
            expect.arrayContaining(['E001', 'John Doe', 'test1@example.com', 'pic1.jpg', null, null, 'Engineer'])
        );
        expect(mockConnection.commit).toHaveBeenCalled();
        expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should handle API failures gracefully', async () => {
        axios.get.mockRejectedValue(new Error('API request failed'));

        await expect(syncEmployees()).rejects.toThrow('API request failed');
        expect(mockConnection.rollback).toHaveBeenCalled();
        expect(mockConnection.release).toHaveBeenCalled();
    });

    it('should skip exited employees', async () => {
        const mockMatrixData = [{ emp_email_id: 'exited@example.com', emp_empl_status: 'Exited' }];
        const mockAcademyData = [{ employee_id: 'E003', firstname: 'Alice', lastname: 'Brown', email: 'exited@example.com' }];

        axios.get.mockResolvedValueOnce({ status: 200, data: mockMatrixData }); // Matrix API
        axios.get.mockResolvedValueOnce({ status: 200, data: mockAcademyData }); // Academy API

        await syncEmployees();

        expect(mockConnection.query).not.toHaveBeenCalledWith(expect.stringContaining('INSERT INTO employee'));
        expect(mockConnection.commit).toHaveBeenCalled();
    });

    // it('should rollback transaction on failure', async () => {
    //     axios.get.mockResolvedValueOnce({ status: 200, data: [] }); // Matrix API
    //     axios.get.mockResolvedValueOnce({ status: 200, data: [] }); // Academy API
    //     mockConnection.query.mockRejectedValue(new Error('Database error'));

    //     await expect(syncEmployees()).rejects.toThrow('Database error');
    //     expect(mockConnection.rollback).toHaveBeenCalled();
    //     expect(mockConnection.release).toHaveBeenCalled();
    // });
});
