const { deleteServiceDivision } = require("../../controllers/deleteServiceDivisionController");
const deleteServiceDivisionService = require("../../services/deleteServiceDivisionService");

jest.mock("../../services/deleteServiceDivisionService");

describe("deleteServiceDivisionController", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { id: "123" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should return 200 when service division is deleted successfully", async () => {
    deleteServiceDivisionService.deleteServiceDivision.mockResolvedValue();

    await deleteServiceDivision(req, res);

    expect(deleteServiceDivisionService.deleteServiceDivision).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Service division deleted successfully" });
  });

  test("should return 500 when an error occurs", async () => {
    deleteServiceDivisionService.deleteServiceDivision.mockRejectedValue(new Error("Database error"));

    await deleteServiceDivision(req, res);

    expect(deleteServiceDivisionService.deleteServiceDivision).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Error deleting Service division" });
  });
});
