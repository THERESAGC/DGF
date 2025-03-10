const { searchManagers } = require("../../controllers/managerSearchByNameController");
const { searchManagersByName } = require("../../services/managerSearchByNameservice");

jest.mock("../../services/managerSearchByNameservice");

describe("searchManagers Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} }; // Empty query initially
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  test("should return 400 if name is missing", async () => {
    await searchManagers(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Name is required" });
  });

  test("should return managers when service responds successfully", async () => {
    req.query.name = "John";
    const mockManagers = [{ id: 1, name: "John Doe", department: "IT" }];
    searchManagersByName.mockResolvedValue(mockManagers);

    await searchManagers(req, res);

    expect(searchManagersByName).toHaveBeenCalledWith("John");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockManagers);
  });

  test("should return 500 if an error occurs", async () => {
    req.query.name = "John";
    searchManagersByName.mockRejectedValue(new Error("Database error"));

    await searchManagers(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while searching for managers",
      details: "Database error",
    });
  });
});
