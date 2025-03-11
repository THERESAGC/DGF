const { getEmpbasedOnIdController } = require("../../controllers/getEmpDetailsCommentController");
const { getEmpbasedOnId } = require("../../services/getEmpDetailsCommentService");

jest.mock("../../services/getEmpDetailsCommentService"); 

describe("getEmpbasedOnIdController", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { empid: "123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 200 and employee details on success", async () => {
    const mockEmployee = { empid: "123", name: "John Doe", designation: "Developer" };
    getEmpbasedOnId.mockResolvedValue(mockEmployee);

    await getEmpbasedOnIdController(req, res);

    expect(getEmpbasedOnId).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployee);
  });

  test("should return 400 if empid is missing", async () => {
    req.params = {}; // No empid provided

    await getEmpbasedOnIdController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "EMployee ID is required" });
  });

  test("should return 500 if an error occurs", async () => {
    getEmpbasedOnId.mockRejectedValue(new Error("Database error"));

    await getEmpbasedOnIdController(req, res);

    expect(getEmpbasedOnId).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving data",
      details: "Database error",
    });
  });
});
