const { getPrimarySkillsByTechStack } = require("../../controllers/primarySkillController");
const primarySkillService = require("../../services/primarySkillService");

jest.mock("../../services/primarySkillService");

describe("Primary Skill Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe("getPrimarySkillsByTechStack", () => {
    test("should return 400 if stack_id is missing", async () => {
      await getPrimarySkillsByTechStack(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "stack_id is required" });
    });

    test("should return 404 if no skills are found", async () => {
      req.query = { stack_id: "123" };
      primarySkillService.getPrimarySkillsByStack.mockResolvedValue([]);

      await getPrimarySkillsByTechStack(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No primary skills found for this tech stack." });
    });

    test("should return 500 if an error occurs", async () => {
      req.query = { stack_id: "123" };
      primarySkillService.getPrimarySkillsByStack.mockRejectedValue(new Error("Database error"));

      await getPrimarySkillsByTechStack(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return skills successfully", async () => {
      req.query = { stack_id: "123" };
      const mockSkills = [{ id: 1, name: "JavaScript" }];

      primarySkillService.getPrimarySkillsByStack.mockResolvedValue(mockSkills);

      await getPrimarySkillsByTechStack(req, res);

      expect(primarySkillService.getPrimarySkillsByStack).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSkills);
    });
  });
});
