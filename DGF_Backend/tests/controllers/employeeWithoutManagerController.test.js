const { getEmployeesByNameWithoutManager } = require("../../controllers/employeeWithoutManagerController");
const { searchEmployeesByNameWithoutManager } = require("../../services/employeeSearchWithoutManagerService");

jest.mock("../../services/employeeSearchWithoutManagerService"); 

describe("getEmployeesByNameWithoutManager", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} }; // Empty query initially
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 200 and list of employees when data is found", async () => {
    req.query = { name: "John" };
    const mockEmployees = [
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Johnny Smith", email: "johnny.smith@example.com" },
    ];
    searchEmployeesByNameWithoutManager.mockResolvedValue(mockEmployees);

    await getEmployeesByNameWithoutManager(req, res);

    expect(searchEmployeesByNameWithoutManager).toHaveBeenCalledWith("John");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployees);
  });

  test("should return 500 if an error occurs", async () => {
    req.query = { name: "John" };
    searchEmployeesByNameWithoutManager.mockRejectedValue(new Error("Database error"));

    await getEmployeesByNameWithoutManager(req, res);

    expect(searchEmployeesByNameWithoutManager).toHaveBeenCalledWith("John");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "Database error",
    });
  });
});
