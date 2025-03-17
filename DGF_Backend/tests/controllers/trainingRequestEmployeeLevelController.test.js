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
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe("storeEmployeeLevels", () => {
    test("should return 400 if requestid is missing", async () => {
      req.body = { designation_names: ["Manager", "Developer"] }; 

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 400 if designation_names is missing", async () => {
      req.body = { requestid: "123" };

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 400 if designation_names is not an array", async () => {
      req.body = { requestid: "123", designation_names: "invalid_data" }; 

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 400 if designation_names is an empty array", async () => {
      req.body = { requestid: "123", designation_names: [] }; 

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid request data" });
    });

    test("should return 500 if an error occurs", async () => {
      req.body = { requestid: "123", designation_names: ["Manager", "Developer"] }; 
      trainingRequestEmployeeLevelService.storeEmployeeLevels.mockRejectedValue(new Error("Database error"));

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return 200 if employee levels are stored successfully", async () => {
      req.body = { requestid: "123", designation_names: ["Manager", "Developer"] }; 
      trainingRequestEmployeeLevelService.storeEmployeeLevels.mockResolvedValue();

      await storeEmployeeLevels(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "Employee levels stored successfully" });
    });
  });
});
