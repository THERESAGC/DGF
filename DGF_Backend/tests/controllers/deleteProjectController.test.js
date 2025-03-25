const { deleteProject } = require("../../controllers/deleteProjectController");
const deleteProjectService = require("../../services/deleteProjectService");

jest.mock("../../services/deleteProjectService");

describe("deleteProject Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should delete a project successfully and return 200", async () => {
    deleteProjectService.deleteProjectService.mockResolvedValue();

    await deleteProject(req, res);

    expect(deleteProjectService.deleteProjectService).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Project deleted successfully" });
  });

  test("should return 500 if an error occurs", async () => {
    deleteProjectService.deleteProjectService.mockRejectedValue(new Error("Database error"));

    await deleteProject(req, res);

    expect(deleteProjectService.deleteProjectService).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error deleting project" });
  });
});
