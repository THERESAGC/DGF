const db = require("../../config/db");
const { addTechStack } = require("../../services/addTechStackService");

jest.mock("../../config/db", () => ({
  promise: jest.fn().mockReturnThis(),
  execute: jest.fn(),
}));

describe("addTechStack Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should insert a tech stack and return its ID", async () => {
    db.execute.mockResolvedValue([{ insertId: 1 }]);

    const result = await addTechStack("MERN");

    expect(db.execute).toHaveBeenCalledWith("INSERT INTO techstack (stack_name) VALUES (?)", ["MERN"]);
    expect(result).toBe(1);
  });

  test("should throw an error if database execution fails", async () => {
    db.execute.mockRejectedValue(new Error("Database error"));

    await expect(addTechStack("MERN")).rejects.toThrow("Database error");
    expect(db.execute).toHaveBeenCalledWith("INSERT INTO techstack (stack_name) VALUES (?)", ["MERN"]);
  });
});
