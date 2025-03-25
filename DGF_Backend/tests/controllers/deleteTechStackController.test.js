const { deleteTechStack } = require("../../controllers/deleteTechStackController");
const techStackService = require("../../services/deleteTechStackService");

jest.mock("../../services/deleteTechStackService");

describe("deleteTechStack Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { stackId: "1" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should delete tech stack successfully and return 200 status", async () => {
    techStackService.deleteTechStackAndSkills.mockResolvedValue(true);

    await deleteTechStack(req, res);

    expect(techStackService.deleteTechStackAndSkills).toHaveBeenCalledWith(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: "Tech stack and associated primary skills deleted successfully",
    });
  });

  test("should return 400 if stackId is not a number", async () => {
    req.params.stackId = "abc"; // Invalid ID

    await deleteTechStack(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Invalid tech stack ID" });
});

  test("should return 500 if an error occurs", async () => {
    techStackService.deleteTechStackAndSkills.mockRejectedValue(new Error("Database error"));

    await deleteTechStack(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Database error" });
  });

  test("should return 500 with 'Internal server error' if error message is undefined", async () => {
    techStackService.deleteTechStackAndSkills.mockRejectedValue(new Error());
  
    await deleteTechStack(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
  
});
