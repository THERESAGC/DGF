const { getEmpNewTrainingRequested } = require("../../controllers/getEmpNewTrainingRequestedController");
const { getEmpNewTrainingRequestedByRequestId } = require("../../services/getEmpNewTrainingRequestedService");

jest.mock("../../services/getEmpNewTrainingRequestedService");

describe("getEmpNewTrainingRequested Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} }; // Empty request object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 400 if requestid is missing", async () => {
    await getEmpNewTrainingRequested(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Request ID is required" });
  });

  test("should return 200 and data on success", async () => {
    req.query.requestid = "123";
    const mockData = [
      { empId: 1, name: "Alice", training: "Leadership" },
      { empId: 2, name: "Bob", training: "Project Management" },
    ];
    getEmpNewTrainingRequestedByRequestId.mockResolvedValue(mockData);

    await getEmpNewTrainingRequested(req, res);

    expect(getEmpNewTrainingRequestedByRequestId).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockData);
  });

  test("should return 500 if an error occurs", async () => {
    req.query.requestid = "123";
    getEmpNewTrainingRequestedByRequestId.mockRejectedValue(new Error("Database error"));

    await getEmpNewTrainingRequested(req, res);

    expect(getEmpNewTrainingRequestedByRequestId).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving data",
      details: "Database error",
    });
  });
});
