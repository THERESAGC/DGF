const { storeEmployeeLevels } = require("../../controllers/trainingRequestEmployeeLevelController");
const trainingRequestEmployeeLevelService = require("../../services/trainingRequestEmployeeLevelService");

jest.mock("../../services/trainingRequestEmployeeLevelService");

describe("Training Request Employee Level Controller", () => {
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

  describe("storeEmployeeLevels", () => {
    test("should return 400 if requestid is missing", async () => {
      req.body = { employee_level_ids: [1, 2, 3] };

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 400 if employee_level_ids is missing", async () => {
      req.body = { requestid: "123" };

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 400 if employee_level_ids is not an array", async () => {
      req.body = { requestid: "123", employee_level_ids: "invalid_data" };

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 400 if employee_level_ids is an empty array", async () => {
      req.body = { requestid: "123", employee_level_ids: [] };

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 500 if an error occurs", async () => {
      req.body = { requestid: "123", employee_level_ids: [1, 2, 3] };
      trainingRequestEmployeeLevelService.storeEmployeeLevels.mockRejectedValue(new Error("Database error"));

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return 200 if employee levels are stored successfully", async () => {
      req.body = { requestid: "123", employee_level_ids: [1, 2, 3] };
      trainingRequestEmployeeLevelService.storeEmployeeLevels.mockResolvedValue();

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Employee levels stored successfully" });
    });
  });
});
