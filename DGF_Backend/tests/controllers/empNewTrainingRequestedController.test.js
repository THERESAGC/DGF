const { insertTrainingRequest } = require("../../controllers/empNewTrainingRequestedController");
const { insertMultipleEmpNewTrainingRequested } = require("../../services/empNewTrainingRequestedService");

jest.mock("../../services/empNewTrainingRequestedService"); 

describe("insertTrainingRequest", () => {
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

    await insertTrainingRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "An array of employee objects is required" });
  });

  test("should return 400 if request body is an empty array", async () => {
    req.body = []; // Empty array

    await insertTrainingRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: "An array of employee objects is required" });
  });

  test("should return 200 if training requests are inserted successfully", async () => {
    req.body = [
      { empId: 1, trainingId: 101 },
      { empId: 2, trainingId: 102 },
    ];
    insertMultipleEmpNewTrainingRequested.mockResolvedValue();

    await insertTrainingRequest(req, res);

    expect(insertMultipleEmpNewTrainingRequested).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ message: "Training requests inserted successfully" });
  });

  test("should return 500 if an error occurs", async () => {
    req.body = [
      { empId: 1, trainingId: 101 },
      { empId: 2, trainingId: 102 },
    ];
    insertMultipleEmpNewTrainingRequested.mockRejectedValue(new Error("Database error"));

    await insertTrainingRequest(req, res);

    expect(insertMultipleEmpNewTrainingRequested).toHaveBeenCalledWith(req.body);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({
      error: "An error occurred while inserting the training requests",
      details: "Database error",
    });
  });
});
