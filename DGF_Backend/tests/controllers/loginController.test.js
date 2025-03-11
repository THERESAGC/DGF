const { getLoginDetails } = require("../../controllers/loginController");
const loginService = require("../../services/loginService");

jest.mock("../../services/loginService"); 
describe("getLoginDetails Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {}; // No params or body needed for this controller
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should return login details when service returns data", async () => {
    const mockLoginDetails = [{ id: 1, username: "johndoe", role: "admin" }];
    loginService.getLoginDetails.mockResolvedValue(mockLoginDetails);

    await getLoginDetails(req, res);

    expect(loginService.getLoginDetails).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockLoginDetails);
  });

  test("should return 500 if an error occurs", async () => {
    loginService.getLoginDetails.mockRejectedValue(new Error("Database error"));

    await getLoginDetails(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error retrieving login details",
    });
  });
});
