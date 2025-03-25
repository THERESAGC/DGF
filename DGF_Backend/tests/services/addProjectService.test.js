const db = require("../../config/db");
const { addProject } = require("../../services/addProjectService");

jest.mock("../../config/db", () => ({
  promise: jest.fn().mockReturnThis(),
  execute: jest.fn(),
}));

describe("addProject Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should insert a new project and return its ID when service division exists", async () => {
    const projectName = "New Project";
    const serviceDivisionId = 123;
    const mockCheckResult = [[{ count: 1 }]];
    const mockInsertResult = [{ insertId: 1 }];

    // Mocking the service division existence check
    db.execute
      .mockResolvedValueOnce(mockCheckResult) // First call: check if serviceDivisionId exists
      .mockResolvedValueOnce(mockInsertResult); // Second call: insert the project

    const result = await addProject(projectName, serviceDivisionId);

    expect(db.execute).toHaveBeenCalledWith(
      "SELECT COUNT(*) AS count FROM service_division WHERE id = ?",
      [serviceDivisionId]
    );
    expect(db.execute).toHaveBeenCalledWith(
      "INSERT INTO projectname (ProjectName, service_division_id) VALUES (?, ?)",
      [projectName, serviceDivisionId]
    );

    expect(result).toBe(1); // Should return the insertId
  });

  test("should throw an error if serviceDivisionId does not exist", async () => {
    const projectName = "New Project";
    const serviceDivisionId = 999;
    const mockCheckResult = [[{ count: 0 }]];

    // Mocking the service division existence check
    db.execute.mockResolvedValueOnce(mockCheckResult);

    await expect(addProject(projectName, serviceDivisionId)).rejects.toThrow(
      "Invalid service_division_id. No such service division exists."
    );

    expect(db.execute).toHaveBeenCalledWith(
      "SELECT COUNT(*) AS count FROM service_division WHERE id = ?",
      [serviceDivisionId]
    );

    expect(db.execute).not.toHaveBeenCalledWith(
      "INSERT INTO projectname (ProjectName, service_division_id) VALUES (?, ?)"
    ); // Ensure insert is not executed
  });

  test("should throw an error if database query fails", async () => {
    const projectName = "New Project";
    const serviceDivisionId = 123;
    const mockError = new Error("Database error");

    db.execute.mockRejectedValue(mockError);

    await expect(addProject(projectName, serviceDivisionId)).rejects.toThrow(
      "Database error"
    );

    expect(db.execute).toHaveBeenCalled();
  });
});
