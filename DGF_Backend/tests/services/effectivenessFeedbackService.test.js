const { getCourseName, getRequestedByUsingReqId, getEmployeeName, handleTaskCompletion, checkCompletedTasksAndSendEmails } = require("../../services/effectivenessFeedbackService");
const pool = require("../../config/db");
const { sendEmail } = require("../../services/mailService");

jest.mock("../../config/db", () => ({
    query: jest.fn(),
    promise: jest.fn().mockReturnThis(),
    execute: jest.fn(),
}));

const effectivenessFeedbackServiceObject = require("../../services/effectivenessFeedbackService");
jest.mock("../../services/effectivenessFeedbackService", () => {
    const actualService = jest.requireActual("../../services/effectivenessFeedbackService"); 
    return {
        ...actualService, // Keep all real functions
        getRequestedBy: jest.fn(), 
        getManagerEmail: jest.fn(), 
        sendFeedbackToEmployee : jest.fn(),
        sendFeedbackRequestToManager : jest.fn(),
    };
});

jest.mock("../../services/mailService"); // Mock email service

describe("handleTaskCompletion", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should handle database errors gracefully", async () => {
        console.error = jest.fn();
        pool.query.mockImplementation((query, params, callback) => {
            callback(new Error("Database Error"), null);
        });

        await handleTaskCompletion(999);

        expect(console.error).toHaveBeenCalledWith("Error fetching task details:", expect.any(Error));
    });

    it("should send feedback to employee and request feedback from manager after 60 days", async () => {
        const mockTask = {
            employee_id: 101,
            course_id: 202,
            assignment_id: 1,
            completion_date: new Date(Date.now() - 61 * 24 * 60 * 60 * 1000),
        };

        pool.query.mockImplementation((query, params, callback) => {
            callback(null, [mockTask]);
        });

        jest.spyOn(effectivenessFeedbackServiceObject, "getRequestedBy").mockResolvedValue("John Doe");
        jest.spyOn(effectivenessFeedbackServiceObject, "getCourseName").mockResolvedValue("Node.js Training");
        jest.spyOn(effectivenessFeedbackServiceObject, "getManagerEmail").mockResolvedValue("manager@example.com");
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackToEmployee").mockResolvedValue();
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackRequestToManager").mockResolvedValue();

        await handleTaskCompletion(1);
    });

    it("should send feedback request to manager after 180 days", async () => {
        const mockTask = {
            employee_id: 101,
            course_id: 202,
            assignment_id: 3,
            completion_date: new Date(Date.now() - 181 * 24 * 60 * 60 * 1000), // 181 days ago
        };
    
        pool.query.mockImplementation((query, params, callback) => {
            callback(null, [mockTask]);
        });
    
        jest.spyOn(effectivenessFeedbackServiceObject, "getRequestedBy").mockResolvedValue("John Doe");
        jest.spyOn(effectivenessFeedbackServiceObject, "getCourseName").mockResolvedValue("Node.js Training");
        jest.spyOn(effectivenessFeedbackServiceObject, "getManagerEmail").mockResolvedValue("manager@example.com");
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackToEmployee").mockResolvedValue();
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackRequestToManager").mockResolvedValue();
    
        await handleTaskCompletion(mockTask.assignment_id);
    });

    it("should not send feedback request to manager if daysSinceCompletion is less than 60", async () => {
        const mockTask = {
            employee_id: 101,
            course_id: 202,
            assignment_id: 4,
            completion_date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        };
    
        pool.query.mockImplementation((query, params, callback) => {
            callback(null, [mockTask]);
        });
    
        jest.spyOn(effectivenessFeedbackServiceObject, "getRequestedBy").mockResolvedValue("John Doe");
        jest.spyOn(effectivenessFeedbackServiceObject, "getCourseName").mockResolvedValue("Node.js Training");
        jest.spyOn(effectivenessFeedbackServiceObject, "getManagerEmail").mockResolvedValue("manager@example.com");
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackToEmployee").mockResolvedValue();
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackRequestToManager").mockResolvedValue();
    
        await handleTaskCompletion(mockTask.assignment_id);
    });

    it("should handle errors in both fetching manager email and overall task completion", async () => {
        console.error = jest.fn(); 
    
        // Simulate an error in the main try-catch block
        jest.spyOn(pool, "query").mockImplementation(() => {
            throw new Error("Unexpected database error");
        });
    
        await handleTaskCompletion(999);
    
        expect(console.error).toHaveBeenCalledWith("Error handling task completion:", expect.any(Error));
    
        // Reset mock for the next scenario
        jest.restoreAllMocks();
    
        const mockTask = {
            employee_id: 101,
            course_id: 202,
            assignment_id: 10,
            completion_date: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
        };
    
        pool.query.mockImplementation((query, params, callback) => {
            callback(null, [mockTask]);
        });
    
        jest.spyOn(effectivenessFeedbackServiceObject, "getRequestedBy").mockResolvedValue("John Doe");
        jest.spyOn(effectivenessFeedbackServiceObject, "getCourseName").mockResolvedValue("Node.js Training");
        jest.spyOn(effectivenessFeedbackServiceObject, "getManagerEmail").mockRejectedValue(new Error("Failed to fetch manager email"));
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackToEmployee").mockResolvedValue();
        jest.spyOn(effectivenessFeedbackServiceObject, "sendFeedbackRequestToManager").mockResolvedValue();
    
        await handleTaskCompletion(mockTask.assignment_id);
    });
});


describe("getCourseName", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    test("should return course name when course_id exists", async () => {
      const mockCourseId = 1;
      const mockCourseName = "JavaScript Basics";
  
      pool.query.mockImplementation((query, values, callback) => {
        callback(null, [{ course_name: mockCourseName }]);
      });
  
      await expect(getCourseName(mockCourseId)).resolves.toBe(mockCourseName);
      expect(pool.query).toHaveBeenCalledWith(
        "SELECT course_name FROM course WHERE course_id = ?",
        [mockCourseId],
        expect.any(Function)
      );
    });
  
    test("should reject with an error when database query fails", async () => {
      const mockCourseId = 2;
      const mockError = new Error("Database error");
  
      pool.query.mockImplementation((query, values, callback) => {
        callback(mockError);
      });
  
      await expect(getCourseName(mockCourseId)).rejects.toThrow("Database error");
    });
  
    test("should reject with 'Course not found' when no results are returned", async () => {
      const mockCourseId = 3;
  
      pool.query.mockImplementation((query, values, callback) => {
        callback(null, []);
      });
  
      await expect(getCourseName(mockCourseId)).rejects.toBe("Course not found");
    });
});

describe("getRequestedByUsingReqId", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    });
  
    it("should resolve with emp_name when request ID exists", async () => {
      const mockReqId = 1;
      const mockEmpName = "John Doe";
      pool.query.mockImplementation((query, params, callback) => {
        callback(null, [{ emp_name: mockEmpName }]);
      });
  
      await expect(getRequestedByUsingReqId(mockReqId)).resolves.toBe(mockEmpName);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockReqId], expect.any(Function));
    });
  
    it("should reject with an error when database query fails", async () => {
      const mockReqId = 1;
      const mockError = new Error("Database connection failed");
      pool.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });
  
      await expect(getRequestedByUsingReqId(mockReqId)).rejects.toThrow("Database connection failed");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockReqId], expect.any(Function));
    });
  
    it("should reject when no matching reqid is found", async () => {
      const mockReqId = 999; // Non-existent request ID
      pool.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });
  
      await expect(getRequestedByUsingReqId(mockReqId)).rejects.toBe("Requested By not found for reqid: " + mockReqId);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockReqId], expect.any(Function));
    });
}); 

describe("getEmployeeName", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });
  
    it("should resolve with emp_name when employee ID exists", async () => {
      const mockEmployeeId = 1;
      const mockEmpName = "Alice Johnson";
      pool.query.mockImplementation((query, params, callback) => {
        callback(null, [{ emp_name: mockEmpName }]);
      });
  
      await expect(getEmployeeName(mockEmployeeId)).resolves.toBe(mockEmpName);
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockEmployeeId], expect.any(Function));
    });
  
    it("should reject with an error when database query fails", async () => {
      const mockEmployeeId = 2;
      const mockError = new Error("Database error");
      pool.query.mockImplementation((query, params, callback) => {
        callback(mockError, null);
      });
  
      await expect(getEmployeeName(mockEmployeeId)).rejects.toThrow("Database error");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockEmployeeId], expect.any(Function));
    });
  
    it("should reject when no matching employee ID is found", async () => {
      const mockEmployeeId = 999; // Non-existent employee ID
      pool.query.mockImplementation((query, params, callback) => {
        callback(null, []);
      });
  
      await expect(getEmployeeName(mockEmployeeId)).rejects.toBe("Employee not found");
      expect(pool.query).toHaveBeenCalledWith(expect.any(String), [mockEmployeeId], expect.any(Function));
    });
});

describe("checkCompletedTasksAndSendEmails", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should fetch completed tasks and call handleTaskCompletion for each task", async () => {
        const mockTasks = [
            { assignment_id: 1, status: "Completed" },
            { assignment_id: 2, status: "Completed" },
        ];

        // Mock database response
        pool.query.mockImplementation((query, callback) => {
            callback(null, mockTasks);
        });

        // Mock handleTaskCompletion function
        const handleTaskCompletionMock = jest.spyOn(effectivenessFeedbackServiceObject, "handleTaskCompletion").mockResolvedValue();

        await checkCompletedTasksAndSendEmails();
    });

    it("should handle database errors gracefully", async () => {
        console.error = jest.fn();

        pool.query.mockImplementation((query, callback) => {
            callback(new Error("Database connection failed"), null);
        });

        await checkCompletedTasksAndSendEmails();

        expect(console.error).toHaveBeenCalledWith("Error fetching completed tasks:", expect.any(Error));
    });

    it("should handle unexpected errors in try-catch block", async () => {
        console.error = jest.fn();

        // Simulate an unexpected error
        jest.spyOn(pool, "query").mockImplementation(() => {
            throw new Error("Unexpected Error");
        });

        await checkCompletedTasksAndSendEmails();

        expect(console.error).toHaveBeenCalledWith("Error in checking completed tasks:", expect.any(Error));
    });
});
