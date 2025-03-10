const { showNotifications, markAsRead } = require("../../controllers/notificationController");
const notificationService = require("../../services/notificationService");

jest.mock("../../services/notificationService");

describe("Notification Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("showNotifications", () => {
    test("should return 400 if empId or roleId is missing", async () => {
      req.query = { empId: "123" }; // Missing roleId

      await showNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Employee ID and role ID are required" });
    });

    test("should return notifications successfully", async () => {
      req.query = { empId: "123", roleId: "2" };
      const mockNotifications = [{ id: 1, message: "New notification" }];

      notificationService.getNotifications.mockResolvedValue(mockNotifications);

      await showNotifications(req, res);

      expect(notificationService.getNotifications).toHaveBeenCalledWith("123", 2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockNotifications);
    });

    test("should return 500 if service throws an error", async () => {
      req.query = { empId: "123", roleId: "2" };
      notificationService.getNotifications.mockRejectedValue(new Error("Database error"));

      await showNotifications(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "An error occurred while retrieving notifications",
        details: "Database error",
      });
    });
  });

  describe("markAsRead", () => {
    test("should return 400 if notificationId or empId is missing", async () => {
      req.body = { empId: "123" }; // Missing notificationId

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Notification ID and employee ID are required" });
    });

    test("should mark notification as read successfully", async () => {
      req.body = { notificationId: "10", empId: "123" };

      notificationService.markNotificationAsRead.mockResolvedValue();

      await markAsRead(req, res);

      expect(notificationService.markNotificationAsRead).toHaveBeenCalledWith("123", "10");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Notification marked as read" });
    });

    test("should return 500 if service throws an error", async () => {
      req.body = { notificationId: "10", empId: "123" };
      notificationService.markNotificationAsRead.mockRejectedValue(new Error("Database error"));

      await markAsRead(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "An error occurred while marking the notification as read",
        details: "Database error",
      });
    });
  });
});
