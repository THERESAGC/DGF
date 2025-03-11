const { updateRequestStatus } = require("../../controllers/requestStatusController");
const requestStatusService = require("../../services/requestStatusService");

jest.mock("../../services/requestStatusService");

describe("Request Status Controller", () => {
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

  describe("updateRequestStatus", () => {
    test("should return 400 if required fields are missing", async () => {
      req.body = { requestId: 1, status: "Approved" }; // Missing roleId and approverId

      await updateRequestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        message: "requestId, status, roleId, and approverId are required",
      });
    });

    test("should return 500 if an error occurs", async () => {
      req.body = { requestId: 1, status: "Approved", roleId: 2, approverId: 3 };
      requestStatusService.updateRequestStatus.mockRejectedValue(new Error("Database error"));

      await updateRequestStatus(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
        error: "Database error",
      });
    });

    test("should update request status successfully", async () => {
      req.body = { requestId: 1, status: "Approved", roleId: 2, approverId: 3 };
      requestStatusService.updateRequestStatus.mockResolvedValue();

      await updateRequestStatus(req, res);

      expect(requestStatusService.updateRequestStatus).toHaveBeenCalledWith(1, "Approved", 2, 3);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Request status updated successfully" });
    });
  });
});
