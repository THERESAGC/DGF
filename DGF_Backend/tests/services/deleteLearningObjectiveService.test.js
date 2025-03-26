const { deleteLearningObjectiveService } = require("../../services/deleteLearningObjectiveService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("deleteLearningObjectiveService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete a learning objective successfully", async () => {
        db.execute.mockResolvedValue([{}]);

        await expect(deleteLearningObjectiveService("101")).resolves.not.toThrow();

        expect(db.execute).toHaveBeenCalledWith(
            "DELETE FROM training_obj WHERE training_id = ?",
            ["101"]
        );
    });

    it("should throw an error if deletion fails", async () => {
        const mockError = new Error("Database error");
        db.execute.mockRejectedValue(mockError);

        await expect(deleteLearningObjectiveService("101")).rejects.toThrow("Database error");

        expect(db.execute).toHaveBeenCalledWith(
            "DELETE FROM training_obj WHERE training_id = ?",
            ["101"]
        );
    });
});
