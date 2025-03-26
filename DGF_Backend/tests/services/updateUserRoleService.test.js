const { updateUserRole } = require("../../services/updateUserRoleService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("updateUserRole Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });
  
  test("should update user role successfully", async () => {
    // Mocking role ID fetch
    db.execute
      .mockImplementationOnce((query, params, callback) => {
        callback(null, [{ role_id: 2 }]); // Simulating role_id = 2 found for given role_name
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(null, { affectedRows: 1 }); // Simulating successful update
      });

    const result = await updateUserRole(101, "Admin");

    expect(db.execute).toHaveBeenCalledTimes(2);
    expect(db.execute).toHaveBeenCalledWith(
      "SELECT role_id FROM role WHERE role_name = ?",
      ["Admin"],
      expect.any(Function)
    );
    expect(db.execute).toHaveBeenCalledWith(
      "UPDATE logintable SET role_id = ? WHERE emp_id = ?",
      [2, 101],
      expect.any(Function)
    );
    expect(result).toEqual({ affectedRows: 1 });
  });

  test("should return error if role is not found", async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(null, []); // Simulating no role found
    });

    await expect(updateUserRole(101, "UnknownRole")).rejects.toThrow("Role not found");

    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(
      "SELECT role_id FROM role WHERE role_name = ?",
      ["UnknownRole"],
      expect.any(Function)
    );
  });

  test("should return error if fetching role ID fails", async () => {
    db.execute.mockImplementationOnce((query, params, callback) => {
      callback(new Error("Database error"), null); // Simulating DB error
    });

    await expect(updateUserRole(101, "Admin")).rejects.toThrow("Database error");

    expect(db.execute).toHaveBeenCalledTimes(1);
    expect(db.execute).toHaveBeenCalledWith(
      "SELECT role_id FROM role WHERE role_name = ?",
      ["Admin"],
      expect.any(Function)
    );
  });

  test("should return error if updating role ID fails", async () => {
    db.execute
      .mockImplementationOnce((query, params, callback) => {
        callback(null, [{ role_id: 2 }]); // Simulating role_id found
      })
      .mockImplementationOnce((query, params, callback) => {
        callback(new Error("Update failed"), null); // Simulating update error
      });

    await expect(updateUserRole(101, "Admin")).rejects.toThrow("Update failed");

    expect(db.execute).toHaveBeenCalledTimes(2);
  });
});
