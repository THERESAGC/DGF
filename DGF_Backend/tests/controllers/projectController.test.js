const { getProjectsByServiceDivision } = require("../../controllers/projectController");
const projectService = require("../../services/projectService");

jest.mock("../../services/projectService");

describe("Project Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {query: {}};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  describe("getProjectsByServiceDivision", () => {
    test("should return 400 if service_division_id is missing", async () => {
      await getProjectsByServiceDivision(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "service_division_id is required" });
    });

    test("should return 404 if no projects are found", async () => {
      req.query.service_division_id = 1;
      projectService.getProjectsByServiceDivision.mockResolvedValue([]);

      await getProjectsByServiceDivision(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No projects found for this service division" });
    });

    test("should return 500 if an error occurs", async () => {
      req.query.service_division_id = 1;
      projectService.getProjectsByServiceDivision.mockRejectedValue(new Error("Database error"));

      await getProjectsByServiceDivision(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return projects successfully", async () => {
      req.query.service_division_id = 1;
      const mockProjects = [{ id: 1, name: "Project A" }, { id: 2, name: "Project B" }];

      projectService.getProjectsByServiceDivision.mockResolvedValue(mockProjects);

      await getProjectsByServiceDivision(req, res);

      expect(projectService.getProjectsByServiceDivision).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProjects);
    });
  });
});
