const { getAllProjects } = require("../../controllers/projectController");
const projectService = require("../../services/projectService");

jest.mock("../../services/projectService");

describe("Project Controller", () => {
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

  describe("getAllProjects", () => {
    test("should return 404 if no projects are found", async () => {
      projectService.getAllProjects.mockResolvedValue([]);

      await getAllProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "No projects found." });
    });

    test("should return 500 if an error occurs", async () => {
      projectService.getAllProjects.mockRejectedValue(new Error("Database error"));

      await getAllProjects(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
    });

    test("should return projects successfully", async () => {
      const mockProjects = [{ id: 1, name: "Project A" }, { id: 2, name: "Project B" }];

      projectService.getAllProjects.mockResolvedValue(mockProjects);

      await getAllProjects(req, res);

      expect(projectService.getAllProjects).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockProjects);
    });
  });
});
