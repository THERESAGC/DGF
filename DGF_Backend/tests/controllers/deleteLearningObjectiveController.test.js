const { deleteLearningObjectiveController } = require("../../controllers/deleteLearningObjectiveController");
const { deleteLearningObjectiveService } = require("../../services/deleteLearningObjectiveService");

jest.mock("../../services/deleteLearningObjectiveService");

describe("deleteLearningObjectiveController", () => {
    let req, res;

    beforeEach(() => {
        req = { params: { trainingId: "101" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if trainingId is not provided", async () => {
        req.params.trainingId = null;

        await deleteLearningObjectiveController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Training ID is required" });
    });

    it("should delete a learning objective successfully", async () => {
        deleteLearningObjectiveService.mockResolvedValue();

        await deleteLearningObjectiveController(req, res);

        expect(deleteLearningObjectiveService).toHaveBeenCalledWith("101");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Learning objective deleted successfully" });
    });

    it("should handle errors when deletion fails", async () => {
        const mockError = new Error("Database error");
        deleteLearningObjectiveService.mockRejectedValue(mockError);

        await deleteLearningObjectiveController(req, res);

        expect(deleteLearningObjectiveService).toHaveBeenCalledWith("101");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Failed to delete learning objective",
            details: "Database error",
        });
    });
});
