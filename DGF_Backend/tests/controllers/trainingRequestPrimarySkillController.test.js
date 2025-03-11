const { storePrimarySkills } = require("../../controllers/trainingRequestPrimarySkillController");
const trainingRequestPrimarySkillService = require("../../services/trainingRequestPrimarySkillService");

jest.mock("../../services/trainingRequestPrimarySkillService");

describe("Training Request Primary Skill Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("storePrimarySkills", () => {
    test("should return 400 if requestid is missing", async () => {
      req.body = { primary_skill_ids: [1, 2, 3] };

      await storePrimarySkills(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid input" });
    });

    test("should return 400 if primary_skill_ids is missing", async () => {
      req.body = { requestid: "123" };

      await storePrimarySkills(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid input" });
    });

    test("should return 400 if primary_skill_ids is not an array", async () => {
      req.body = { requestid: "123", primary_skill_ids: "invalid_data" };

      await storePrimarySkills(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Invalid input" });
    });

    test("should return 500 if an error occurs", async () => {
      req.body = { requestid: "123", primary_skill_ids: [1, 2, 3] };
      trainingRequestPrimarySkillService.storePrimarySkills.mockRejectedValue(new Error("Database error"));

      await storePrimarySkills(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "An error occurred while storing primary skills",
        details: "Database error",
      });
    });

    test("should return 200 if primary skills are stored successfully", async () => {
      req.body = { requestid: "123", primary_skill_ids: [1, 2, 3] };
      trainingRequestPrimarySkillService.storePrimarySkills.mockResolvedValue("Success");

      await storePrimarySkills(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Primary skills stored successfully",
        result: "Success",
      });
    });
  });
});
