const db = require("../../config/db");
const { deleteProjectService } = require("../../services/deleteProjectService");

jest.mock("../../config/db");

describe("deleteProjectService", () => {
  test("should delete a project successfully", async () => {
    db.execute.mockResolvedValue();

    await deleteProjectService("123");

    expect(db.execute).toHaveBeenCalledWith("DELETE FROM projectname WHERE ProjectID = ?", ["123"]);
  });

  test("should throw an error if database query fails", async () => {
    db.execute.mockRejectedValue(new Error("Database error"));

    await expect(deleteProjectService("123")).rejects.toThrow("Database error");

    expect(db.execute).toHaveBeenCalledWith("DELETE FROM projectname WHERE ProjectID = ?", ["123"]);
  });
});
