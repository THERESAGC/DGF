const { getTrainingRequestDetailsById } = require("../../controllers/getTrainingRequestDetailsController");
const { getTrainingRequestDetails } = require("../../services/getTrainingRequestDetailsService");

jest.mock("../../services/getTrainingRequestDetailsService"); 

describe("getTrainingRequestDetailsController", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 400 if request ID is missing", async () => {
    await getTrainingRequestDetailsById(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Request ID is required" });
  });

  test("should return training request details when found", async () => {
    req.params.requestid = "123";
    const mockRequestDetails = { requestid: "123", name: "Training A" };
    getTrainingRequestDetails.mockResolvedValue(mockRequestDetails);

    await getTrainingRequestDetailsById(req, res);

    expect(getTrainingRequestDetails).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockRequestDetails);
  });

  test("should return 404 if training request not found", async () => {
    req.params.requestid = "123";
    getTrainingRequestDetails.mockResolvedValue(null);

    await getTrainingRequestDetailsById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Training request not found" });
  });

  test("should return 500 if an error occurs", async () => {
    req.params.requestid = "123";
    getTrainingRequestDetails.mockRejectedValue(new Error("Database error"));

    await getTrainingRequestDetailsById(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving the training request details",
      details: "Database error",
    });
  });
});
