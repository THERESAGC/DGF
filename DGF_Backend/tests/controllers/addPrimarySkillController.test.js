const { addPrimarySkill } = require("../../controllers/addPrimarySkillController");
const primarySkillService = require("../../services/addPrimarySkillService");

jest.mock("../../services/addPrimarySkillService");

describe("addPrimarySkill Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should return 400 if skillName is missing", async () => {
    req.body = { stackId: 1 }; // Missing skillName

    await addPrimarySkill(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Skill name and stack ID are required" });
  });

  test("should return 400 if stackId is missing", async () => {
    req.body = { skillName: "JavaScript" }; // Missing stackId

    await addPrimarySkill(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Skill name and stack ID are required" });
  });

  test("should return 201 and skill details if successful", async () => {
    req.body = { skillName: "JavaScript", stackId: 2 };
    primarySkillService.addPrimarySkill.mockResolvedValue(101); // Mock skillId

    await addPrimarySkill(req, res);

    expect(primarySkillService.addPrimarySkill).toHaveBeenCalledWith("JavaScript", 2);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      skillId: 101,
      skillName: "JavaScript",
      stackId: 2,
    });
  });

  test("should return 500 if service throws an error", async () => {
    req.body = { skillName: "JavaScript", stackId: 2 };
    primarySkillService.addPrimarySkill.mockRejectedValue(new Error("Database error"));

    await addPrimarySkill(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
