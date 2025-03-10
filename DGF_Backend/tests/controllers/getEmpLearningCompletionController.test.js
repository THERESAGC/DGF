const { getEmployeeCompletionStatus } = require("../../controllers/getEmpLearningCompletionController");
const employeeService = require("../../services/getEmpLearningCompletionService");

jest.mock("../../services/getEmpLearningCompletionService"); 

describe("getEmployeeCompletionStatus Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { requestId: "456" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 200 and employee completion status on success", async () => {
    const mockCompletionStatus = { requestId: "456", status: "Completed" };
    employeeService.getEmployeeCompletionStatus.mockResolvedValue(mockCompletionStatus);

    await getEmployeeCompletionStatus(req, res);

    expect(employeeService.getEmployeeCompletionStatus).toHaveBeenCalledWith("456");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockCompletionStatus);
  });

  test("should return 500 if an error occurs", async () => {
    employeeService.getEmployeeCompletionStatus.mockRejectedValue(new Error("Database error"));

    await getEmployeeCompletionStatus(req, res);

    expect(employeeService.getEmployeeCompletionStatus).toHaveBeenCalledWith("456");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error fetching employee completion status",
      error: new Error("Database error"),
    });
  });
});
