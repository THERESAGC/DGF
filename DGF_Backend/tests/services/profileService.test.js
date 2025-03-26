const db = require("../../config/db");
const { getEmployeeDetailsById } = require("../../services/profileService");

jest.mock("../../config/db", () => ({
    promise: jest.fn(),
}));

describe("getEmployeeDetailsById Service", () => {
    let mockConnection;

    beforeEach(() => {
        mockConnection = {
            query: jest.fn(),
        };
        db.promise.mockResolvedValue(mockConnection);
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return employee details when query is successful", async () => {
        const mockEmployee = [
            {
                emp_name: "John Doe",
                emp_email: "johndoe@example.com",
                profile_image: "image.jpg",
                Designation_Name: "Software Engineer",
                emp_id: 123,
                system_role: "Admin",
            },
        ];
        mockConnection.query.mockResolvedValue([mockEmployee]);

        const result = await getEmployeeDetailsById(123);

        expect(result).toEqual(mockEmployee[0]);
        expect(db.promise).toHaveBeenCalled();
        expect(mockConnection.query).toHaveBeenCalledWith(expect.any(String), [123]);
    });

    it("should throw an error when query fails", async () => {
        const errorMessage = new Error("Database error");
        mockConnection.query.mockRejectedValue(errorMessage);

        await expect(getEmployeeDetailsById(123)).rejects.toThrow("Database error");

        expect(db.promise).toHaveBeenCalled();
        expect(mockConnection.query).toHaveBeenCalledWith(expect.any(String), [123]);
    });
});
