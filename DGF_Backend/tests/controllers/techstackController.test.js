const { getAllTechStacks } = require("../../controllers/techstackController");
const techstackService = require("../../services/techstackService");

jest.mock("../../services/techstackService");

describe("Tech Stack Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe("getAllTechStacks", () => {
    test("should return 404 if no tech stacks are found", async () => {
      techstackService.getAllTechStacks.mockResolvedValue([]);

      await getAllTechStacks(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No tech stacks found." });
    });

    test("should return 500 if an error occurs", async () => {
      techstackService.getAllTechStacks.mockRejectedValue(new Error("Database error"));

      await getAllTechStacks(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return 200 and tech stacks if successful", async () => {
      const mockTechStacks = [{ id: 1, name: "JavaScript" }];
      techstackService.getAllTechStacks.mockResolvedValue(mockTechStacks);

      await getAllTechStacks(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockTechStacks);
    });
  });
});
