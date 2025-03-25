const { addProjectController } = require("../../controllers/addProjectController");
const { addProject } = require("../../services/addProjectService");

jest.mock("../../services/addProjectService");

describe("addProject Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should return 201 and success message when project is added", async () => {
    req.body = { ProjectName: "New Project", serviceDivisionId: 123 };
    const mockResult = { insertId: 1 };

    addProject.mockResolvedValue(mockResult);

    await addProjectController(req, res);

    expect(addProject).toHaveBeenCalledWith("New Project", 123);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Project added successfully",
      data: {
        ProjectID: 1,
        ProjectName: "New Project",
        service_division_id: 123,
      },
    });
  });

  test("should return 500 and error message when service throws an error", async () => {
    req.body = { ProjectName: "New Project", serviceDivisionId: 123 };
    const mockError = new Error("Database error");

    addProject.mockRejectedValue(mockError);

    await addProjectController(req, res);

    expect(addProject).toHaveBeenCalledWith("New Project", 123);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error adding project",
      error: "Database error",
    });
  });

  test("should return 400 if ProjectName is missing", async () => {
    req.body = { serviceDivisionId: 123 }; // Missing ProjectName

    await addProjectController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Project name and service division ID are required",
    });
  });

  test("should return 400 if serviceDivisionId is missing", async () => {
    req.body = { ProjectName: "New Project" }; // Missing serviceDivisionId

    await addProjectController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Project name and service division ID are required",
    });
  });
});
