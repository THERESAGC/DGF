const { getAssignedCourses } = require("../../controllers/getassignedCoursesController");
const { getAssignedCoursesByEmployeeAndRequest } = require("../../services/getassignedCoursesService");

jest.mock("../../services/getassignedCoursesService"); 

describe("getAssignedCourses", () => {
  let req, res;

  beforeEach(() => {
    req = { params: { emp_id: "101", request_id: "202" } };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should return 200 and assigned courses on success", async () => {
    const mockCourses = [
      { courseId: 1, courseName: "React Basics" },
      { courseId: 2, courseName: "Node.js Advanced" },
    ];
    getAssignedCoursesByEmployeeAndRequest.mockResolvedValue(mockCourses);

    await getAssignedCourses(req, res);

    expect(getAssignedCoursesByEmployeeAndRequest).toHaveBeenCalledWith("101", "202");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: mockCourses });
  });

  test("should return 400 if emp_id or request_id is missing", async () => {
    req.params = {}; // Missing parameters

    await getAssignedCourses(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "emp_id and request_id are required parameters" });
  });

  test("should return 500 if an error occurs", async () => {
    getAssignedCoursesByEmployeeAndRequest.mockRejectedValue(new Error("Database failure"));

    await getAssignedCourses(req, res);

    expect(getAssignedCoursesByEmployeeAndRequest).toHaveBeenCalledWith("101", "202");
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      message: "Internal Server Error",
      error: "Database failure",
    });
  });
});
