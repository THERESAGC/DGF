const { getLearnersController } = require("../../controllers/learnerController");
const { getLearnersService } = require("../../services/learnerService");

jest.mock("../../services/learnerService"); 

describe("getLearnersController", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return learners when emp_id is provided", async () => {
    req.params.emp_id = "101";
    const mockLearners = [{ id: 1, name: "John Doe" }];
    getLearnersService.mockResolvedValue(mockLearners);

    await getLearnersController(req, res);

    expect(getLearnersService).toHaveBeenCalledWith("101");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLearners);
  });

  test("should return 500 if an error occurs", async () => {
    req.params.emp_id = "101";
    getLearnersService.mockRejectedValue(new Error("Database error"));

    await getLearnersController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving the learners",
      details: "Database error",
    });
  });
});
