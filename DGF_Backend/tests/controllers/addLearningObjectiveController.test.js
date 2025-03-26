const { addLearningObjectiveController } = require("../../controllers/addLearningObjectiveController");
const { addLearningObjective } = require("../../services/addLearningObjectiveService");

jest.mock("../../services/addLearningObjectiveService");

describe("addLearningObjectiveController", () => {
    let req, res;

    beforeEach(() => {
        req = { body: {} };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });

    it("should return 400 if training_name is missing", async () => {
        req.body = { source_id: 1 };

        await addLearningObjectiveController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Training name is required" });
    });

    it("should return 201 and success message when learning objective is added", async () => {
        req.body = { training_name: "Node.js Training", source_id: 2 };
        addLearningObjective.mockResolvedValue({ insertId: 101 });

        await addLearningObjectiveController(req, res);

        expect(addLearningObjective).toHaveBeenCalledWith("Node.js Training", 2);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Learning objective added successfully",
            data: { training_id: 101, training_name: "Node.js Training", source_id: 2 },
        });
    });

    it("should return 201 and set source_id to null if not provided", async () => {
        req.body = { training_name: "React Training" };
        addLearningObjective.mockResolvedValue({ insertId: 102 });

        await addLearningObjectiveController(req, res);

        expect(addLearningObjective).toHaveBeenCalledWith("React Training", null);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            message: "Learning objective added successfully",
            data: { training_id: 102, training_name: "React Training", source_id: undefined },
        });
    });

    it("should return 500 if addLearningObjective service throws an error", async () => {
        req.body = { training_name: "Python Training", source_id: 3 };
        addLearningObjective.mockRejectedValue(new Error("Database error"));

        await addLearningObjectiveController(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({
            error: "Failed to add learning objective",
            details: "Database error",
        });
    });
});
