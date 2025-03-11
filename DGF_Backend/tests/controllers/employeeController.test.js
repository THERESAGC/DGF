const { getEmployeesByDesignationController } = require("../../controllers/employeeController");
const { getEmployeesByDesignation } = require("../../services/employeeDesignationService");

jest.mock("../../services/employeeDesignationService"); 

describe("getEmployeesByDesignationController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { designationIds: "1,2,3" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should return 400 if designationIds is missing", async () => {
    req.query = {}; // Empty query

    await getEmployeesByDesignationController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Designation IDs are required" });
  });

  test("should return 200 and list of employees if successful", async () => {
    const mockEmployees = [
      { id: 1, name: "Alice", designationId: 1 },
      { id: 2, name: "Bob", designationId: 2 },
    ];
    getEmployeesByDesignation.mockResolvedValue(mockEmployees);

    await getEmployeesByDesignationController(req, res);

    expect(getEmployeesByDesignation).toHaveBeenCalledWith([1, 2, 3]);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployees);
  });

  test("should return 500 if service throws an error", async () => {
    getEmployeesByDesignation.mockRejectedValue(new Error("Database error"));

    await getEmployeesByDesignationController(req, res);

    expect(getEmployeesByDesignation).toHaveBeenCalledWith([1, 2, 3]);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving employees",
      details: "Database error",
    });
  });
});
