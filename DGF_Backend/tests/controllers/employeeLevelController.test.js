const { getAllJobTitles } = require("../../controllers/employeeLevelController");
const employeeLevelService = require("../../services/employeeLevelService");

jest.mock("../../services/employeeLevelService"); 

describe("getAllJobTitles", () => {
  let req, res;

  beforeEach(() => {
    req = {}; 
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should return 200 and job titles if data is found", async () => {
    const mockJobTitles = [
      { id: 1, title: "Software Engineer" },
      { id: 2, title: "Project Manager" },
    ];
    employeeLevelService.getAllJobTitles.mockResolvedValue(mockJobTitles);

    await getAllJobTitles(req, res);

    expect(employeeLevelService.getAllJobTitles).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(mockJobTitles);
  });

  test("should return 404 if no job titles are found", async () => {
    employeeLevelService.getAllJobTitles.mockResolvedValue([]);

    await getAllJobTitles(req, res);

    expect(employeeLevelService.getAllJobTitles).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ message: "No job titles found." });
  });

  test("should return 500 if an error occurs", async () => {
    employeeLevelService.getAllJobTitles.mockRejectedValue(new Error("Database error"));

    await getAllJobTitles(req, res);

    expect(employeeLevelService.getAllJobTitles).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
