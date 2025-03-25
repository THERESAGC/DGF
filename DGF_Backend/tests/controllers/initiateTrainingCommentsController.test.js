const {
    getTrainingComments,
    addTrainingComments,
  } = require("../../controllers/initiateTrainingCommentsController");
  const InitiateTrainingcommentService = require("../../services/initiateTrainingCommentsService");
  
  jest.mock("../../services/initiateTrainingCommentsService");
  
  describe("initiateTrainingCommentsController", () => {
    let req, res;
  
    beforeEach(() => {
      req = { query: {}, body: {} };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    });

    beforeEach(() => {
      jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    });
  
    describe("getTrainingComments", () => {
      test("should return 400 if assignment_id is missing", async () => {
        await getTrainingComments(req, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ error: "Missing assignment_id" });
      });
  
      test("should return comments successfully", async () => {
        req.query.assignment_id = "123";
        const mockComments = [{ id: 1, text: "Test comment" }];
        InitiateTrainingcommentService.getTrainingCommentsByAssignmentId.mockResolvedValue(mockComments);
        
        await getTrainingComments(req, res);
        
        expect(InitiateTrainingcommentService.getTrainingCommentsByAssignmentId).toHaveBeenCalledWith("123");
        expect(res.json).toHaveBeenCalledWith(mockComments);
      });
  
      test("should return 500 if fetching comments fails", async () => {
        req.query.assignment_id = "123";
        InitiateTrainingcommentService.getTrainingCommentsByAssignmentId.mockRejectedValue(new Error());
        
        await getTrainingComments(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to fetch training comments" });
      });
    });
  
    describe("addTrainingComments", () => {
      test("should add comment successfully", async () => {
        req.body = { assignment_id: "123", comment_text: "Great job!", created_by: "John", created_date: "2024-03-17" };
        InitiateTrainingcommentService.addTrainingComments.mockResolvedValue(1);
        
        await addTrainingComments(req, res);
        
        expect(InitiateTrainingcommentService.addTrainingComments).toHaveBeenCalledWith("123", "Great job!", "John", "2024-03-17");
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({ message: "Training Comments added successfully", comment_id: 1 });
      });
  
      test("should return 500 if adding comment fails", async () => {
        req.body = { assignment_id: "123", comment_text: "Great job!", created_by: "John", created_date: "2024-03-17" };
        InitiateTrainingcommentService.addTrainingComments.mockRejectedValue(new Error());
        
        await addTrainingComments(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: "Failed to add Training comment" });
      });
    });
});
  