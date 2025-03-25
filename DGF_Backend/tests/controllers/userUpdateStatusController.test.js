const { updateUserStatusController } = require("../../controllers/userUpdateStatusController");
const { updateUserStatus } = require("../../services/userUpdateStatusService");

jest.mock("../../services/userUpdateStatusService");

describe("updateUserStatusController", () => {
  let req, res;

  beforeEach(() => {
    req = { body: { userId: 101, status: "active" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should update user status successfully and return 200 status", async () => {
    updateUserStatus.mockResolvedValue();

    await updateUserStatusController(req, res);

    expect(updateUserStatus).toHaveBeenCalledWith(101, "active");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "User status updated successfully" });
  });

  test("should return 400 if userId or status is missing", async () => {
    req.body = { userId: null, status: "active" };

    await updateUserStatusController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "userId and status are required" });
  });

  test("should return 500 if an error occurs", async () => {
    updateUserStatus.mockRejectedValue(new Error("Database error"));

    await updateUserStatusController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error", error: "Database error" });
  });
});
