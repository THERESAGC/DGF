const { getSourcesByRole } = require("../../controllers/roleController");
const roleService = require("../../services/roleService");

jest.mock("../../services/roleService");

describe("Role Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe("getSourcesByRole", () => {
    test("should return 400 if role_id is missing", async () => {
      await getSourcesByRole(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "role_id is required" });
    });

    test("should return 404 if no sources found", async () => {
      req.query = { role_id: "1" };
      roleService.getSourcesByRole.mockResolvedValue([]);

      await getSourcesByRole(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        message: "No sources found for this role.",
      });
    });

    test("should return 500 if an error occurs", async () => {
      req.query = { role_id: "1" };
      roleService.getSourcesByRole.mockRejectedValue(new Error("Database error"));

      await getSourcesByRole(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal Server Error",
      });
    });

    test("should return 200 and sources if successful", async () => {
      req.query = { role_id: "1" };
      const mockSources = [{ id: 1, name: "HR" }];
      roleService.getSourcesByRole.mockResolvedValue(mockSources);

      await getSourcesByRole(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockSources);
    });
  });
});
