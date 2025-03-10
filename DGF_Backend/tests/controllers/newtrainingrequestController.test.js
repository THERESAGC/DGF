const { createNewTrainingRequest } = require("../../controllers/newtrainingrequestController");
const newTrainingRequestService = require("../../services/newTrainingRequestService");

jest.mock("../../services/newTrainingRequestService");

describe("createNewTrainingRequest Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        requestid: 1,
        requestonbehalfof: "John Doe",
        source: "Internal",
        trainingobj: "Advanced Java Training",
        projectid: null,
        newprospectname: "Prospect ABC",
        numberofpeople: 10,
        expecteddeadline: "2025-04-01",
        techstack: "Java, Spring Boot",
        primaryskill: "Java",
        otherskill: "Microservices",
        suggestedcompletioncriteria: "Certification",
        comments: "Urgent requirement",
        servicedivision: "IT",
        requestedbyid: 101,
        org_level: "Mid",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test("should return 400 if required fields are missing", async () => {
    delete req.body.requestid;

    await createNewTrainingRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ message: "Missing required fields" });
  });

  test("should default projectid to 999 if null", async () => {
    newTrainingRequestService.createNewRequest.mockResolvedValue({ id: 1 });

    await createNewTrainingRequest(req, res);

    expect(newTrainingRequestService.createNewRequest).toHaveBeenCalledWith(
      expect.objectContaining({ projectid: 999 })
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Training request created successfully",
      data: { id: 1 },
    });
  });

  test("should keep the provided projectid if not null", async () => {
    req.body.projectid = 100;
    newTrainingRequestService.createNewRequest.mockResolvedValue({ id: 1 });
  
    await createNewTrainingRequest(req, res);
  
    expect(newTrainingRequestService.createNewRequest).toHaveBeenCalledWith(
      expect.objectContaining({ projectid: 100 }) 
    );
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      message: "Training request created successfully",
      data: { id: 1 },
    });
  });
  

  test("should return 500 if an error occurs", async () => {
    newTrainingRequestService.createNewRequest.mockRejectedValue(new Error("Database error"));

    await createNewTrainingRequest(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: "Internal Server Error" });
  });
});
