const db = require("../../config/db");
const { saveExistingFeedback, saveManagerFeedback } = require("../../services/feedbackService");

jest.mock("../../config/db");

describe("Feedback Service", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console errors
    });

    describe("saveExistingFeedback", () => {
        const feedbackData = {
            reqid: 1,
            course_id: 101,
            employee_id: 1001,
            instruction_rating: 5,
            training_topic: "JavaScript",
            engaged_rating: 4,
            interactive: "Yes",
            interactive_components: "Quizzes",
            improved_comments: "More hands-on examples",
            engaged_session_rating: 5,
            other_suggestions: "Include more exercises"
        };

        it("should save feedback successfully", async () => {
            const mockResult = { insertId: 1 };

            db.execute.mockImplementation((query, values, callback) => {
                process.nextTick(() => callback(null, mockResult)); // Ensures async behavior
            });

            const result = await saveExistingFeedback(feedbackData);

            expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function));
            expect(result).toEqual(mockResult);
        });

        it("should throw an error when database query fails", async () => {
            const mockError = new Error("Database error");

            db.execute.mockImplementation((query, values, callback) => {
                process.nextTick(() => callback(mockError, null)); // Mimic async DB error
            });

            await expect(saveExistingFeedback(feedbackData)).rejects.toThrow("Database error");
        });
    });

    describe("saveManagerFeedback", () => {
        const managerFeedbackData = {
            reqid: 2,
            course_id: 102,
            employee_id: 1002,
            demonstrate_skill: "Yes",
            skill_date: "2025-03-25",
            enhancement_rating: 3,
            suggestions: "Needs improvement in problem-solving",
            opportunity_date: null
        };

        it("should save manager feedback successfully", async () => {
            const mockResult = { insertId: 2 };

            db.execute.mockImplementation((query, values, callback) => {
                process.nextTick(() => callback(null, mockResult)); // Ensures async behavior
            });

            const result = await saveManagerFeedback(managerFeedbackData);

            expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function));
            expect(result).toEqual(mockResult);
        });

        it("should throw an error when database query fails", async () => {
            const mockError = new Error("Database error");

            db.execute.mockImplementation((query, values, callback) => {
                process.nextTick(() => callback(mockError, null)); // Mimic async DB error
            });

            await expect(saveManagerFeedback(managerFeedbackData)).rejects.toThrow("Database error");
        });
    });
});
