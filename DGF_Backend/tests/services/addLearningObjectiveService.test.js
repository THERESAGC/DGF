const { addLearningObjective } = require("../../services/addLearningObjectiveService");
const db = require("../../config/db");

jest.mock("../../config/db", () => ({
    promise: jest.fn().mockReturnThis(),
    execute: jest.fn(),
}));

describe("addLearningObjective Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should insert a new learning objective successfully", async () => {
        const mockResult = [{ insertId: 101 }];
        db.execute.mockResolvedValue(mockResult);

        const result = await addLearningObjective("Node.js Training", 2);

        expect(db.execute).toHaveBeenCalledWith(
            "INSERT INTO training_obj (training_name, source_id) VALUES (?, ?)", 
            ["Node.js Training", 2]
        );
        expect(result).toEqual({ insertId: 101 });
    });

    it("should insert a new learning objective with source_id as null", async () => {
        const mockResult = [{ insertId: 102 }];
        db.execute.mockResolvedValue(mockResult);

        const result = await addLearningObjective("React Training", null);

        expect(db.execute).toHaveBeenCalledWith(
            "INSERT INTO training_obj (training_name, source_id) VALUES (?, ?)", 
            ["React Training", null]
        );
        expect(result).toEqual({ insertId: 102 });
    });

    it("should throw an error when database operation fails", async () => {
        db.execute.mockRejectedValue(new Error("Database error"));

        await expect(addLearningObjective("Python Training", 3))
            .rejects
            .toThrow("Database error");

        expect(db.execute).toHaveBeenCalledWith(
            "INSERT INTO training_obj (training_name, source_id) VALUES (?, ?)", 
            ["Python Training", 3]
        );
    });
});
