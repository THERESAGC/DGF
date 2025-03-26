const { getAllLearnerFeedback } = require("../../services/getAllLearnerFeedbackService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("getAllLearnerFeedback Service", () => {
    it("should return all learner feedback successfully", async () => {
        const mockResults = [
            { id: 1, emp_name: "John Doe", emp_email: "john@example.com", rating: 5 },
            { id: 2, emp_name: "Jane Smith", emp_email: "jane@example.com", rating: 4 }
        ];

        db.query.mockImplementation((query, callback) => {
            callback(null, mockResults);
        });

        const result = await getAllLearnerFeedback();

        expect(db.query).toHaveBeenCalledTimes(1);
        expect(result).toEqual(mockResults);
    });

    it("should reject with an error if the database query fails", async () => {
        const mockError = new Error("Database error");

        db.query.mockImplementation((query, callback) => {
            callback(mockError, null);
        });

        await expect(getAllLearnerFeedback()).rejects.toThrow("Database error");
        expect(db.query).toHaveBeenCalledTimes(2);
    });
});
