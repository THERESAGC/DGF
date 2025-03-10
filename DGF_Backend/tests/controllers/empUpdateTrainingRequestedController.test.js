const { updateMultipleTrainingRequests } = require("../../controllers/empUpdateTrainingRequestedController");
const { updateMultipleEmpNewTrainingRequested } = require("../../services/empUpdateTrainingRequestedService");

jest.mock("../../services/empUpdateTrainingRequestedService"); 

describe("updateMultipleTrainingRequests", () => {
  let req, res;

  beforeEach(() => {
    req = { body: [] }; // Empty body initially
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks(); 
  });

  test("should return 400 if request body is not an array", async () => {
    req.body = { empId: 1, trainingId: 101 }; // Invalid input (not an array)

    await updateMultipleTrainingRequests(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "An array of employee objects is required" });
  });

  test("should return 400 if request body is an empty array", async () => {
    req.body = []; // Empty array

    await updateMultipleTrainingRequests(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "An array of employee objects is required" });
  });

  test("should return 200 if training requests are updated successfully", async () => {
    req.body = [
      { empId: 1, trainingId: 101, status: "Completed" },
      { empId: 2, trainingId: 102, status: "Pending" },
    ];
    updateMultipleEmpNewTrainingRequested.mockResolvedValue("Update successful");

    await updateMultipleTrainingRequests(req, res);

    expect(updateMultipleEmpNewTrainingRequested).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Training requests updated successfully", result: "Update successful" });
  });

  test("should return 500 if an error occurs", async () => {
    req.body = [
      { empId: 1, trainingId: 101, status: "Completed" },
      { empId: 2, trainingId: 102, status: "Pending" },
    ];
    updateMultipleEmpNewTrainingRequested.mockRejectedValue(new Error("Database error"));

    await updateMultipleTrainingRequests(req, res);

    expect(updateMultipleEmpNewTrainingRequested).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while updating the training requests",
      details: "Database error",
    });
  });
});
