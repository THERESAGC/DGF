const { addTechStack } = require("../../controllers/addTechStackController");
const techStackService = require("../../services/addTechStackService");

jest.mock("../../services/addTechStackService");

describe("addTechStack Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  test("should return 400 if stackName is missing", async () => {
    await addTechStack(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Tech stack name is required" });
  });

  test("should return 201 and stackId when tech stack is added successfully", async () => {
    req.body.stackName = "MERN";
    techStackService.addTechStack.mockResolvedValue(1);

    await addTechStack(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ stackId: 1, stackName: "MERN" });
  });

  test("should return 500 if an error occurs", async () => {
    req.body.stackName = "MERN";
    techStackService.addTechStack.mockRejectedValue(new Error("Database error"));

    await addTechStack(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
  });
});
