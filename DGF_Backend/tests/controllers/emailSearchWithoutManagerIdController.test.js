const { getEmployeesByPartialEmailController } = require("../../controllers/emailSearchWithoutManagerIdController");
const { getEmployeesByPartialEmail } = require("../../services/emailSearchWithoutManagerIdService");

jest.mock("../../services/emailSearchWithoutManagerIdService"); 
describe("getEmployeesByPartialEmailController", () => {
  let req, res;

  beforeEach(() => {
    req = {
      query: { email: "test@example.com" },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 400 if email is not provided", async () => {
    req.query.email = "";

    await getEmployeesByPartialEmailController(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Email is required" });
  });

  test("should return employees data and 200 on success", async () => {
    const mockEmployees = [
      { id: 1, name: "John Doe", email: "john.doe@example.com" },
      { id: 2, name: "Jane Doe", email: "jane.doe@example.com" },
    ];
    getEmployeesByPartialEmail.mockResolvedValue(mockEmployees);

    await getEmployeesByPartialEmailController(req, res);

    expect(getEmployeesByPartialEmail).toHaveBeenCalledWith("test@example.com");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockEmployees);
  });

  test("should return 500 if service throws an error", async () => {
    getEmployeesByPartialEmail.mockRejectedValue(new Error("Database error"));

    await getEmployeesByPartialEmailController(req, res);

    expect(getEmployeesByPartialEmail).toHaveBeenCalledWith("test@example.com");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while retrieving the employees",
      details: "Database error",
    });
  });
});
