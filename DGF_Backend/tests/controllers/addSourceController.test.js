const { addSourceController } = require("../../controllers/addSourceController");
const { addSource } = require("../../services/addSourceService");

jest.mock("../../services/addSourceService");

describe("addSourceController", () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it("should return 400 if source_name is missing", async () => {
        await addSourceController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Source name is required" });
    });

    it("should add a source and return 201 status", async () => {
        req.body.source_name = "Internal Training";
        const mockResult = { insertId: 101 };
        addSource.mockResolvedValue(mockResult);

        await addSourceController(req, res);

        expect(addSource).toHaveBeenCalledWith("Internal Training");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Source added successfully",
            data: mockResult,
        });
    });

    it("should return 500 if addSource service throws an error", async () => {
        req.body.source_name = "External Course";
        const mockError = new Error("Database error");
        addSource.mockRejectedValue(mockError);

        await addSourceController(req, res);

        expect(addSource).toHaveBeenCalledWith("External Course");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Failed to add source",
            details: "Database error",
        });
    });
});
