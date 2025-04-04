const { getAssignedCoursesByEmployee } = require('../../services/getAssignedCoursesByEmployeeService');
const db = require('../../config/db');

jest.mock('../../config/db');

describe('getAssignedCoursesByEmployee', () => {
    test('should return assigned courses data when query is successful', async () => {
        const mockResults = [{ id: 1, course_name: 'ReactJS Basics' }];
        db.execute.mockImplementation((query, params, callback) => {
            callback(null, mockResults);
        });

        const result = await getAssignedCoursesByEmployee(123);
        expect(result).toEqual(mockResults);
    });

    test('should return an empty array if no courses are assigned', async () => {
        db.execute.mockImplementation((query, params, callback) => {
            callback(null, []);
        });

        const result = await getAssignedCoursesByEmployee(456);
        expect(result).toEqual([]);
    });

    test('should throw an error if the database query fails', async () => {
        const mockError = new Error('Database connection failed');
        db.execute.mockImplementation((query, params, callback) => {
            callback(mockError, null);
        });

        await expect(getAssignedCoursesByEmployee(789)).rejects.toThrow('Database connection failed');
    });
});
