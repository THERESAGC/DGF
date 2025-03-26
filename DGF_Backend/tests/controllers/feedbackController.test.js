const feedbackService = require("../../services/feedbackService");
const { submitFeedback, submitManagerFeedback } = require("../../controllers/feedbackController");

jest.mock("../../services/feedbackService");

describe("Feedback Controller", () => {
    let req, res;

    beforeEach(() => {
        req = { body: { feedback: "Great course!", rating: 5 } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        jest.clearAllMocks();
    });

    describe("submitFeedback", () => {
        it("should submit feedback successfully", async () => {
            const mockResponse = { id: 1, feedback: "Great course!", rating: 5 };
            feedbackService.saveExistingFeedback.mockResolvedValue(mockResponse);

            await submitFeedback(req, res);

            expect(feedbackService.saveExistingFeedback).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Feedback submitted successfully",
                data: mockResponse
            });
        });

        it("should return 500 if an error occurs", async () => {
            const mockError = new Error("Database error");
            feedbackService.saveExistingFeedback.mockRejectedValue(mockError);

            await submitFeedback(req, res);

            expect(feedbackService.saveExistingFeedback).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error submitting feedback",
                error: "Database error"
            });
        });
    });

    describe("submitManagerFeedback", () => {
        it("should submit manager feedback successfully", async () => {
            const mockResponse = { id: 1, feedback: "Needs improvement", rating: 3 };
            feedbackService.saveManagerFeedback.mockResolvedValue(mockResponse);

            await submitManagerFeedback(req, res);

            expect(feedbackService.saveManagerFeedback).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({
                message: "Manager feedback submitted successfully",
                data: mockResponse
            });
        });

        it("should return 500 if an error occurs", async () => {
            const mockError = new Error("Database error");
            feedbackService.saveManagerFeedback.mockRejectedValue(mockError);

            await submitManagerFeedback(req, res);

            expect(feedbackService.saveManagerFeedback).toHaveBeenCalledWith(req.body);
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({
                message: "Error submitting manager feedback",
                error: "Database error"
            });
        });
    });
});
