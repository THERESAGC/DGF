const { searchEmployees } = require("../../controllers/employeeSearchByNameController");
const { searchEmployeesByName } = require("../../services/employeeSearchByNameService");

jest.mock("../../services/employeeSearchByNameService");

describe("searchEmployees", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} }; // Empty query initially
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 400 if managerId or name is missing", async () => {
    req.query = { name: "John" }; // Missing managerId

    await searchEmployees(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Manager ID and name are required",
    });

    req.query = { managerId: "123" }; // Missing name

    await searchEmployees(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Manager ID and name are required",
    });
  });

  test("should return 200 and employee list when data is found", async () => {
    req.query = { managerId: "123", name: "John" };
    const mockEmployees = [
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Johnny Doe", email: "johnny.doe@example.com" },
    ];
    searchEmployeesByName.mockResolvedValue(mockEmployees);

    await searchEmployees(req, res);

    expect(searchEmployeesByName).toHaveBeenCalledWith("123", "John");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployees);
  });

  test("should return 500 if an error occurs", async () => {
    req.query = { managerId: "123", name: "John" };
    searchEmployeesByName.mockRejectedValue(new Error("Database error"));

    await searchEmployees(req, res);

    expect(searchEmployeesByName).toHaveBeenCalledWith("123", "John");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while searching for employees",
      details: "Database error",
    });
  });
});
