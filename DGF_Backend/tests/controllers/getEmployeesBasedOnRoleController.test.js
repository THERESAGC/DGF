const { getEmpsforCapdev } = require("../../controllers/getEmployeesBasedOnRoleController");
const { getEmployeesBasedOnRole } = require("../../services/getEmployeesBasedOnRoleService");

jest.mock("../../services/getEmployeesBasedOnRoleService"); // Mock the service

describe("getEmpsforCapdev Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {}; // No params needed
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); // Reset mocks before each test
  });

  test("should return 200 and employees based on role on success", async () => {
    const mockEmployees = [
      { id: 1, name: "John Doe", role: "Manager" },
      { id: 2, name: "Jane Smith", role: "Developer" },
    ];
    getEmployeesBasedOnRole.mockResolvedValue(mockEmployees);

    await getEmpsforCapdev(req, res);

    expect(getEmployeesBasedOnRole).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployees);
  });

  test("should return 500 if an error occurs", async () => {
    getEmployeesBasedOnRole.mockRejectedValue(new Error("Database error"));

    await getEmpsforCapdev(req, res);

    expect(getEmployeesBasedOnRole).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving data",
      details: "Database error",
    });
  });
});
