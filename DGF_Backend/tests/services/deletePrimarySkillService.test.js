const { deletePrimarySkill } = require("../../services/deletePrimarySkillService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("deletePrimarySkillService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    });

    it("should delete a primary skill successfully", async () => {
        db.execute.mockResolvedValue([{ affectedRows: 1 }]); // Mock successful deletion

        await expect(deletePrimarySkill(101)).resolves.not.toThrow();

        expect(db.execute).toHaveBeenCalledWith(
            "DELETE FROM primaryskill WHERE skill_id = ?",
            [101]
        );
    });

    it("should not throw an error if no rows are affected", async () => {
        db.execute.mockResolvedValue([{ affectedRows: 0 }]); // Mock no record found

        await expect(deletePrimarySkill(999)).resolves.not.toThrow();

        expect(db.execute).toHaveBeenCalledWith(
            "DELETE FROM primaryskill WHERE skill_id = ?",
            [999]
        );
    });

    it("should throw an error if deletion fails", async () => {
        const mockError = new Error("Database error");
        db.execute.mockRejectedValue(mockError); // Mock a database error

        await expect(deletePrimarySkill(101)).rejects.toThrow("Failed to delete primary skill");

        expect(db.execute).toHaveBeenCalledWith(
            "DELETE FROM primaryskill WHERE skill_id = ?",
            [101]
        );
    });
});
