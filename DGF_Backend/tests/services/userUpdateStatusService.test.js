const { updateUserStatus } = require("../../services/userUpdateStatusService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("updateUserStatus Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test("should update user status successfully", async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, { affectedRows: 1 }); // Simulating successful update
    });

    const result = await updateUserStatus(101, "Active");

    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(
      "UPDATE logintable SET status = ? WHERE emp_id = ?",
      ["Active", 101],
      expect.any(Function)
    );
    expect(result).toEqual({ affectedRows: 1 });
  });

  test("should return error if updating user status fails", async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error("Update failed"), null); // Simulating DB error
    });

    await expect(updateUserStatus(101, "Inactive")).rejects.toThrow("Update failed");

    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(
      "UPDATE logintable SET status = ? WHERE emp_id = ?",
      ["Inactive", 101],
      expect.any(Function)
    );
  });
});
