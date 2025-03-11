const { getTrainingObjectivesBySource } = require("../../controllers/trainingObjectivesController");
const trainingService = require("../../services/trainingObjectivesService");

jest.mock("../../services/trainingObjectivesService");

describe("Training Controller", () => {
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

  describe("getTrainingObjectivesBySource", () => {
    test("should return 400 if source_id is missing", async () => {
      await getTrainingObjectivesBySource(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "source_id is required" });
    });

    test("should return 404 if no training objectives are found", async () => {
      req.query.source_id = "123";
      trainingService.getTrainingObjectivesBySource.mockResolvedValue([]);

      await getTrainingObjectivesBySource(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No training objectives found for this source." });
    });

    test("should return 500 if an error occurs", async () => {
      req.query.source_id = "123";
      trainingService.getTrainingObjectivesBySource.mockRejectedValue(new Error("Database error"));

      await getTrainingObjectivesBySource(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return 200 and training objectives if successful", async () => {
      req.query.source_id = "123";
      const mockObjectives = [{ id: 1, name: "Objective 1" }];
      trainingService.getTrainingObjectivesBySource.mockResolvedValue(mockObjectives);

      await getTrainingObjectivesBySource(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockObjectives);
    });
  });
});
