const { getMaxRequestId } = require("../../controllers/getMaxRequestIdController");
const getMaxRequestIdService = require("../../services/getMaxRequestIdService");

jest.mock("../../services/getMaxRequestIdService"); 

describe("getMaxRequestId Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {}; // Empty request object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should return 200 and the new request ID on success", async () => {
    getMaxRequestIdService.getMaxRequestId.mockResolvedValue(101);

    await getMaxRequestId(req, res);

    expect(getMaxRequestIdService.getMaxRequestId).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Max Request ID fetched successfully",
      newRequestId: 101,
    });
  });

  test("should return 500 if an error occurs", async () => {
    getMaxRequestIdService.getMaxRequestId.mockRejectedValue(new Error("Database error"));

    await getMaxRequestId(req, res);

    expect(getMaxRequestIdService.getMaxRequestId).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
    });
  });
});
