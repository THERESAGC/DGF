const { getAllManagerFeedbackController } = require("../../controllers/getAllManagerFeedbackController");
const { getAllManagerFeedback } = require("../../services/getAllManagerFeedbackService");

jest.mock("../../services/getAllManagerFeedbackService");

describe("getAllManagerFeedbackController", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it("should return all manager feedback with status 200", async () => {
        const mockFeedback = [
            { id: 1, manager_name: "John Doe", feedback: "Great work" },
            { id: 2, manager_name: "Jane Smith", feedback: "Needs improvement" }
        ];

        getAllManagerFeedback.mockResolvedValue(mockFeedback);

        await getAllManagerFeedbackController(req, res);

        expect(getAllManagerFeedback).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockFeedback);
    });

    it("should return 500 if an error occurs", async () => {
        const mockError = new Error("Database error");
        getAllManagerFeedback.mockRejectedValue(mockError);

        await getAllManagerFeedbackController(req, res);

        expect(getAllManagerFeedback).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "An error occurred while retrieving manager feedback",
            details: "Database error"
        });
    });
});
