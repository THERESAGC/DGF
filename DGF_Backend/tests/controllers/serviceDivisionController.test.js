const { getAllServices } = require("../../controllers/serviceDivisionController");
const serviceDivisionService = require("../../services/serviceDivisionService");

jest.mock("../../services/serviceDivisionService");

describe("Service Division Controller", () => {
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

  describe("getAllServices", () => {
    test("should return 404 if no services are found", async () => {
      serviceDivisionService.getAllServices.mockResolvedValue([]);

      await getAllServices(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No services found." });
    });

    test("should return 500 if an error occurs", async () => {
      serviceDivisionService.getAllServices.mockRejectedValue(new Error("Database error"));

      await getAllServices(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return 200 and services if successful", async () => {
      const mockServices = [{ id: 1, name: "IT Services" }];
      serviceDivisionService.getAllServices.mockResolvedValue(mockServices);

      await getAllServices(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ services: mockServices });
    });
  });
});
