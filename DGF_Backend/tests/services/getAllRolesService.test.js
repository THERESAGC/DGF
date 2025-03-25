const db = require("../../config/db");
const { getAllRoles } = require("../../services/getAllRolesService");

jest.mock("../../config/db");

describe("getAllRoles Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    test("should resolve with roles data when query is successful", async () => {
        const mockRoles = [
            { id: 1, name: "Admin" },
            { id: 2, name: "User" }
        ];
        
        db.execute.mockImplementation((query, callback) => {
            callback(null, mockRoles); // Simulating a successful DB query
        });

        const result = await getAllRoles();
        expect(result).toEqual(mockRoles);
        expect(db.execute).toHaveBeenCalledWith("SELECT * FROM role", expect.any(Function));
    });

    test("should reject with an error when query fails", async () => {
        const mockError = new Error("Database error");

        db.execute.mockImplementation((query, callback) => {
            callback(mockError, null); // Simulating a database error
        });

        await expect(getAllRoles()).rejects.toThrow("Database error");
        expect(db.execute).toHaveBeenCalledWith("SELECT * FROM role", expect.any(Function));
    });
});
