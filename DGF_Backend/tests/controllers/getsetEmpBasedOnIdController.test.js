const { getEmpbyId, setAssignedTo } = require("../../controllers/getsetEmpBasedOnIdController");
const getsetEmpBasedOnIdService = require("../../services/getsetEmpBasedOnIdService");

jest.mock("../../services/getsetEmpBasedOnIdService"); 

describe("getsetEmpBasedOnIdService", () => {
  let req, res;

  beforeEach(() => {
    req = { params: {}, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  describe("getEmpbyId", () => {
    test("should return employee name when found", async () => {
      req.params.empid = "123";
      getsetEmpBasedOnIdService.getEmployeeById.mockResolvedValue("John Doe");

      await getEmpbyId(req, res);

      expect(getsetEmpBasedOnIdService.getEmployeeById).toHaveBeenCalledWith("123");
      expect(res.json).toHaveBeenCalledWith("John Doe");
    });

    test("should return 500 on error", async () => {
      req.params.empid = "123";
      getsetEmpBasedOnIdService.getEmployeeById.mockRejectedValue(new Error("Database error"));

      await getEmpbyId(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch emp name" });
    });
  });

  describe("setAssignedTo", () => {
    test("should return success message when assigned", async () => {
      req.body = { requestid: "101", emp_id: "123" };
      getsetEmpBasedOnIdService.setAssignedTobyId.mockResolvedValue("101");

      await setAssignedTo(req, res);

      expect(getsetEmpBasedOnIdService.setAssignedTobyId).toHaveBeenCalledWith("101", "123");
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "Assigned to added successfully",
        updatedreqid: "101",
      });
    });

    test("should return 500 on error", async () => {
      req.body = { requestid: "101", emp_id: "123" };
      getsetEmpBasedOnIdService.setAssignedTobyId.mockRejectedValue(new Error("Database error"));

      await setAssignedTo(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Failed to add assigned to" });
    });
  });
});
