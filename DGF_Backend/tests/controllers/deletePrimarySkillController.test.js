const { deletePrimarySkillController } = require("../../controllers/deletePrimarySkillController");
const { deletePrimarySkill } = require("../../services/deletePrimarySkillService");

jest.mock("../../services/deletePrimarySkillService");

describe("deletePrimarySkillController", () => {
    let req, res;

    beforeEach(() => {
        req = { params: { skillId: "123" } };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return 400 if skillId is missing", async () => {
        req.params.skillId = undefined;

        await deletePrimarySkillController(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Skill ID is required" });
    });

    it("should delete a primary skill successfully", async () => {
        deletePrimarySkill.mockResolvedValue();

        await deletePrimarySkillController(req, res);

        expect(deletePrimarySkill).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Primary skill deleted successfully" });
    });

    it("should return 500 if deletion fails", async () => {
        const mockError = new Error("Database error");
        deletePrimarySkill.mockRejectedValue(mockError);

        await deletePrimarySkillController(req, res);

        expect(deletePrimarySkill).toHaveBeenCalledWith("123");
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
    });
});
