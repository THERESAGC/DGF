const { getAllFeedback } = require("../../controllers/getAllLearnerFeedbackController");
const { getAllLearnerFeedback } = require("../../services/getAllLearnerFeedbackService");

jest.mock("../../services/getAllLearnerFeedbackService");

describe("getAllFeedback Controller", () => {
    let req, res;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    it("should return all learner feedback with status 200", async () => {
        const mockFeedback = [
            { id: 1, course: "JavaScript", rating: 5 },
            { id: 2, course: "Python", rating: 4 }
        ];

        getAllLearnerFeedback.mockResolvedValue(mockFeedback);

        await getAllFeedback(req, res);

        expect(getAllLearnerFeedback).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockFeedback);
    });

    it("should return 500 if an error occurs", async () => {
        const mockError = new Error("Database error");
        getAllLearnerFeedback.mockRejectedValue(mockError);

        await getAllFeedback(req, res);

        expect(getAllLearnerFeedback).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "An error occurred while retrieving learner feedback",
            details: "Database error"
        });
    });
});
