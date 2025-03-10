const { searchEmployees } = require("../../controllers/employeeSearchByEmailController");
const { searchEmployeesByManagerIdAndEmail } = require("../../services/employeeSearchByEmailService");

jest.mock("../../services/employeeSearchByEmailService"); 

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

  test("should return 400 if managerid or emailPrefix is missing", async () => {
    req.query = { emailPrefix: "john.doe" }; // Missing managerid

    await searchEmployees(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Manager ID and email prefix are required",
    });

    req.query = { managerid: "123" }; // Missing emailPrefix

    await searchEmployees(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Manager ID and email prefix are required",
    });
  });

  test("should return 200 and employee list when data is found", async () => {
    req.query = { managerid: "123", emailPrefix: "john.doe" };
    const mockEmployees = [
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Johnny Doe", email: "johnny.doe@example.com" },
    ];
    searchEmployeesByManagerIdAndEmail.mockResolvedValue(mockEmployees);

    await searchEmployees(req, res);

    expect(searchEmployeesByManagerIdAndEmail).toHaveBeenCalledWith("123", "john.doe");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployees);
  });

  test("should return 500 if an error occurs", async () => {
    req.query = { managerid: "123", emailPrefix: "john.doe" };
    searchEmployeesByManagerIdAndEmail.mockRejectedValue(new Error("Database error"));

    await searchEmployees(req, res);

    expect(searchEmployeesByManagerIdAndEmail).toHaveBeenCalledWith("123", "john.doe");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving employees",
      details: "Database error",
    });
  });
});
