const db = require("../../config/db");
const { addPrimarySkill } = require("../../services/addPrimarySkillService");

jest.mock("../../config/db", () => ({
  promise: jest.fn().mockReturnThis(),
  execute: jest.fn(),
}));

describe("addPrimarySkill Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should throw an error if stack_id does not exist", async () => {
    const skillName = "JavaScript";
    const stackId = 999;

    db.execute.mockResolvedValue([[{ count: 0 }]]); // Mock no matching stack_id

    await expect(addPrimarySkill(skillName, stackId)).rejects.toThrow(
      "Invalid stack_id. No such tech stack exists."
    );

    expect(db.execute).toHaveBeenCalledWith("SELECT COUNT(*) AS count FROM techstack WHERE stack_id = ?", [stackId]);
  });

  test("should insert a primary skill and return skillId", async () => {
    const skillName = "JavaScript";
    const stackId = 2;
    const insertId = 101;

    db.execute
      .mockResolvedValueOnce([[{ count: 1 }]]) // Mock stack_id exists
      .mockResolvedValueOnce([{ insertId }]); // Mock insert operation

    const result = await addPrimarySkill(skillName, stackId);

    expect(db.execute).toHaveBeenCalledTimes(2);
    expect(db.execute).toHaveBeenCalledWith("SELECT COUNT(*) AS count FROM techstack WHERE stack_id = ?", [stackId]);
    expect(db.execute).toHaveBeenCalledWith("INSERT INTO primaryskill (skill_name, stack_id) VALUES (?, ?)", [
      skillName,
      stackId,
    ]);
    expect(result).toBe(insertId);
  });

  test("should throw an error if database query fails", async () => {
    const skillName = "JavaScript";
    const stackId = 2;

    db.execute.mockRejectedValue(new Error("Database error"));

    await expect(addPrimarySkill(skillName, stackId)).rejects.toThrow("Database error");
  });
});
