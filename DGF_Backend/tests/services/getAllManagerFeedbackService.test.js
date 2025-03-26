const { getAllManagerFeedback } = require("../../services/getAllManagerFeedbackService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("getAllManagerFeedback Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all manager feedback from the database", async () => {
        const mockFeedback = [
            { id: 1, employee_id: 101, emp_name: "John Doe", feedback: "Excellent work" },
            { id: 2, employee_id: 102, emp_name: "Jane Smith", feedback: "Needs improvement" }
        ];

        db.query.mockImplementation((query, callback) => {
            callback(null, mockFeedback);
        });

        const result = await getAllManagerFeedback();

        expect(db.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockFeedback);
    });

    it("should reject with an error if the database query fails", async () => {
        const mockError = new Error("Database error");

        db.query.mockImplementation((query, callback) => {
            callback(mockError, null);
        });

        await expect(getAllManagerFeedback()).rejects.toThrow("Database error");
        expect(db.query).toHaveBeenCalledTimes(1);
    });
});
