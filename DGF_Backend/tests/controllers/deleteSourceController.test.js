const { deleteSourceController } = require("../../controllers/deleteSourceController");
const { deleteSourceService } = require("../../services/deleteSourceService");

jest.mock("../../services/deleteSourceService");

describe("deleteSourceController", () => {
    let req, res;

    beforeEach(() => {
        req = { params: { sourceId: "123" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if sourceId is missing", async () => {
        req.params.sourceId = undefined;

        await deleteSourceController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Source ID is required" });
    });

    it("should delete a source successfully", async () => {
        deleteSourceService.mockResolvedValue();

        await deleteSourceController(req, res);

        expect(deleteSourceService).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Source deleted successfully" });
    });

    it("should return 500 if deletion fails", async () => {
        const mockError = new Error("Database error");
        deleteSourceService.mockRejectedValue(mockError);

        await deleteSourceController(req, res);

        expect(deleteSourceService).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to delete source", details: "Database error" });
    });
});
