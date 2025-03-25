const { addServiceDivisionController } = require("../../controllers/addServiceDivisionController");
const { addSeviceDivision } = require("../../services/addServiceDivisionService");

jest.mock("../../services/addServiceDivisionService");

describe("addServiceDivision Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should return 201 and success message when service division is added", async () => {
    req.body = { service_name: "IT Services" };
    const mockResult = { insertId: 1 };

    addSeviceDivision.mockResolvedValue(mockResult);

    await addServiceDivisionController(req, res);

    expect(addSeviceDivision).toHaveBeenCalledWith("IT Services");
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Service division added successfully",
      data: mockResult,
    });
  });

  test("should return 500 and error message when service throws an error", async () => {
    req.body = { service_name: "IT Services" };
    const mockError = new Error("Database error");

    addSeviceDivision.mockRejectedValue(mockError);

    await addServiceDivisionController(req, res);

    expect(addSeviceDivision).toHaveBeenCalledWith("IT Services");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error adding service division",
      error: "Database error",
    });
  });

  test("should return 500 if service_name is missing", async () => {
    req.body = {}; // Missing service_name

    await addServiceDivisionController(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Error adding service division",
      error: expect.any(String),
    });
  });
});
