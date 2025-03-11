const { getOrgLevelLearnerDataController } = require("../../controllers/orgLevelLearnerController");
const orgLevelLearnerService = require("../../services/orgLevelLearnerService");

jest.mock("../../services/orgLevelLearnerService");

describe("Org Level Learner Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  describe("getOrgLevelLearnerDataController", () => {
    test("should return 500 if service throws an error", async () => {
      req.params = { emp_id: "123" };
      orgLevelLearnerService.getOrgLevelLearnerDataService.mockRejectedValue(new Error("Database error"));

      await getOrgLevelLearnerDataController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "An error occurred while retrieving the learners",
        details: "Database error",
      });
    });

    test("should return learner data successfully", async () => {
      req.params = { emp_id: "123" };
      const mockLearners = [{ id: 1, name: "John Doe" }];

      orgLevelLearnerService.getOrgLevelLearnerDataService.mockResolvedValue(mockLearners);

      await getOrgLevelLearnerDataController(req, res);

      expect(orgLevelLearnerService.getOrgLevelLearnerDataService).toHaveBeenCalledWith("123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockLearners);
    });
  });
});
