const { getAllRequests } = require("../../controllers/getAllTrainingRequestsController");
const { getAllTrainingRequests } = require("../../services/getAllTrainingRequestsService");

jest.mock("../../services/getAllTrainingRequestsService"); 
describe("getAllRequests", () => {
  let req, res;

  beforeEach(() => {
    req = {}; // No request body needed
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 200 and list of training requests on success", async () => {
    const mockRequests = [
      { requestId: 1, empId: 101, trainingName: "Java Basics" },
      { requestId: 2, empId: 102, trainingName: "Node.js Advanced" },
    ];
    getAllTrainingRequests.mockResolvedValue(mockRequests);

    await getAllRequests(req, res);

    expect(getAllTrainingRequests).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRequests);
  });

  test("should return 500 if an error occurs", async () => {
    getAllTrainingRequests.mockRejectedValue(new Error("Database error"));

    await getAllRequests(req, res);

    expect(getAllTrainingRequests).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving training requests",
      details: "Database error",
    });
  });
});
