const User = require('../../models/User'); 
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
    execute: jest.fn(),
}));

describe('User Model', () => {
    afterEach(() => {
        jest.clearAllMocks(); 
    });

    test('should return user details when email exists', (done) => {
        const mockEmail = 'test@example.com';
        const mockUserData = [{ id: 1, email: mockEmail, name: 'Test User' }];

        db.execute.mockImplementation((query, params, callback) => {
            callback(null, mockUserData);
        });

        User.findByEmail(mockEmail, (err, result) => {
            expect(err).toBeNull();
            expect(result).toEqual(mockUserData);
            expect(db.execute).toHaveBeenCalledWith(
                'SELECT * FROM logintable WHERE email = ?',
                [mockEmail],
                expect.any(Function)
            );
            done();
        });
    });

    test('should return error on database failure', (done) => {
        const mockEmail = 'test@example.com';
        const mockError = new Error('Database error');

        db.execute.mockImplementation((query, params, callback) => {
            callback(mockError, null);
        });

        User.findByEmail(mockEmail, (err, result) => {
            expect(err).toEqual(mockError);
            expect(result).toBeNull();
            expect(db.execute).toHaveBeenCalledWith(
                'SELECT * FROM logintable WHERE email = ?',
                [mockEmail],
                expect.any(Function)
            );
            done();
        });
    });
});
