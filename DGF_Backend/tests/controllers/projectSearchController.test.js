const { searchProjects } = require("../../controllers/projectSearchController");
const { searchProjectsByName } = require("../../services/projectSearchService");

jest.mock("../../services/projectSearchService");

describe("searchProjects Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} }; // Default query object
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  test("should return 400 if search letter is missing", async () => {
    await searchProjects(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "Search letter is required" });
    expect(searchProjectsByName).not.toHaveBeenCalled();
  });

  test("should return 200 and search results if service succeeds", async () => {
    req.query.letter = "A";
    const mockResults = [{ projectId: 1, projectName: "Alpha" }];
    searchProjectsByName.mockResolvedValue(mockResults);

    await searchProjects(req, res);

    expect(searchProjectsByName).toHaveBeenCalledWith("A");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockResults);
  });

  test("should return 500 if an error occurs", async () => {
    req.query.letter = "A";
    searchProjectsByName.mockRejectedValue(new Error("Database error"));

    await searchProjects(req, res);

    expect(searchProjectsByName).toHaveBeenCalledWith("A");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while searching projects",
      details: "Database error",
    });
  });
});
