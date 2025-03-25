const { updateUserRoleController } = require("../../controllers/updateUserRoleController");
const { updateUserRole } = require("../../services/updateUserRoleService");

jest.mock("../../services/updateUserRoleService");

describe("updateUserRoleController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { emp_id: 123, role_name: "Admin" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should update user role successfully and return 200 status", async () => {
    updateUserRole.mockResolvedValue({ emp_id: 123, role_name: "Admin" });

    await updateUserRoleController(req, res);

    expect(updateUserRole).toHaveBeenCalledWith(123, "Admin");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Role updated successfully",
      result: { emp_id: 123, role_name: "Admin" },
    });
  });

  test("should return 500 if an error occurs", async () => {
    updateUserRole.mockRejectedValue(new Error("Database error"));

    await updateUserRoleController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
  });
});
