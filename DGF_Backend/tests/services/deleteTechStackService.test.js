const db = require("../../config/db");
const { deleteTechStackAndSkills } = require("../../services/deleteTechStackService");

jest.mock("../../config/db");

describe("deleteTechStackAndSkills Service", () => {
  let connection;

  beforeEach(() => {
    connection = {
      beginTransaction: jest.fn(),
      execute: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    };
    db.promise.mockReturnValue({
      getConnection: jest.fn().mockResolvedValue(connection),
    });
  });

  test("should delete associated primary skills and tech stack successfully", async () => {
    const stackId = 1;
    connection.execute.mockResolvedValueOnce() // Deleting primary skills
      .mockResolvedValueOnce([{ affectedRows: 1 }]); // Deleting tech stack

    const result = await deleteTechStackAndSkills(stackId);

    expect(connection.beginTransaction).toHaveBeenCalled();
    expect(connection.execute).toHaveBeenCalledWith(
      "DELETE FROM primaryskill WHERE stack_id = ?",
      [stackId]
    );
    expect(connection.execute).toHaveBeenCalledWith(
      "DELETE FROM techstack WHERE stack_id = ?",
      [stackId]
    );
    expect(connection.commit).toHaveBeenCalled();
    expect(result).toBe(true);
  });

  test("should throw an error if tech stack is not found", async () => {
    const stackId = 1;
    connection.execute.mockResolvedValueOnce() // Deleting primary skills
      .mockResolvedValueOnce([{ affectedRows: 0 }]); // No tech stack found

    await expect(deleteTechStackAndSkills(stackId)).rejects.toThrow("Tech stack not found");

    expect(connection.rollback).toHaveBeenCalled();
  });

  test("should rollback if an error occurs", async () => {
    const stackId = 1;
    connection.execute.mockRejectedValue(new Error("Database error"));

    await expect(deleteTechStackAndSkills(stackId)).rejects.toThrow("Database error");

    expect(connection.rollback).toHaveBeenCalled();
    expect(connection.release).toHaveBeenCalled();
  });
});
