const { deleteEmployee } = require("../../controllers/empDeleteTrainingRequestedController");
const { deleteEmployeeFromTrainingRequest } = require("../../services/empDeleteTrainingRequestedService");

jest.mock("../../services/empDeleteTrainingRequestedService"); 

describe("deleteEmployee Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: { empId: 123, requestId: 456 },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); // Clear mocks before each test
  });

  test("should return 400 if empId or requestId is missing", async () => {
    req.body = {}; // Empty request body

    await deleteEmployee(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Employee ID and Request ID are required" });
  });

  test("should return 200 and success message if deletion is successful", async () => {
    const mockResult = { success: true };
    deleteEmployeeFromTrainingRequest.mockResolvedValue(mockResult);

    await deleteEmployee(req, res);

    expect(deleteEmployeeFromTrainingRequest).toHaveBeenCalledWith(123, 456);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Employee deleted from training request successfully",
      result: mockResult,
    });
  });

  test("should return 500 if service throws an error", async () => {
    deleteEmployeeFromTrainingRequest.mockRejectedValue(new Error("Database error"));

    await deleteEmployee(req, res);

    expect(deleteEmployeeFromTrainingRequest).toHaveBeenCalledWith(123, 456);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error deleting employee from training request",
      error: new Error("Database error"),
    });
  });
});
