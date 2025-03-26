const db = require("../../config/db");
const reminderService = require("../../services/inititateTrainingRemindersService");

jest.mock("../../config/db");

describe("Training Reminders Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {});
    });

    describe("createReminder", () => {
        it("should successfully create a reminder", async () => {
            const mockReminder = {
                assignment_id: 1,
                reminder_date: "2025-03-30",
                reminder_text: "Training session reminder",
                created_by: "Admin"
            };

            db.query.mockImplementation((query, values, callback) => {
                callback(null, { insertId: 1 });
            });

            const result = await reminderService.createReminder(mockReminder);
            expect(result).toEqual({ insertId: 1 });
            expect(db.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function));
        });

        it("should return an error if creation fails", async () => {
            db.query.mockImplementation((query, values, callback) => {
                callback(new Error("Database error"), null);
            });

            await expect(reminderService.createReminder({})).rejects.toThrow("Database error");
        });
    });

    describe("deleteReminder", () => {
        it("should successfully delete a reminder", async () => {
            db.query.mockImplementation((query, values, callback) => {
                callback(null, { affectedRows: 1 });
            });

            const result = await reminderService.deleteReminder(1);
            expect(result).toEqual({ affectedRows: 1 });
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [1], expect.any(Function));
        });

        it("should return an error if deletion fails", async () => {
            db.query.mockImplementation((query, values, callback) => {
                callback(new Error("Delete error"), null);
            });

            await expect(reminderService.deleteReminder(1)).rejects.toThrow("Delete error");
        });
    });

    describe("updateReminder", () => {
        it("should successfully update a reminder", async () => {
            const updatedFields = { reminder_date: "2025-04-01", reminder_text: "Updated reminder" };

            db.query.mockImplementation((query, values, callback) => {
                callback(null, { affectedRows: 1 });
            });

            const result = await reminderService.updateReminder(1, updatedFields);
            expect(result).toEqual({ affectedRows: 1 });
            expect(db.query).toHaveBeenCalledWith(expect.any(String), [updatedFields.reminder_date, updatedFields.reminder_text, 1], expect.any(Function));
        });

        it("should return an error if update fails", async () => {
            db.query.mockImplementation((query, values, callback) => {
                callback(new Error("Update error"), null);
            });

            await expect(reminderService.updateReminder(1, {})).rejects.toThrow("Update error");
        });
    });

    describe("getRemindersByDate", () => {
        it("should successfully retrieve reminders", async () => {
            const mockReminders = [{ reminder_id: 1, assignment_id: 10, reminder_date: "2025-03-30", reminder_text: "Test reminder" }];

            db.query.mockImplementation((query, values, callback) => {
                callback(null, mockReminders);
            });

            const result = await reminderService.getRemindersByDate();
            expect(result).toEqual(mockReminders);
            expect(db.query).toHaveBeenCalledWith(expect.any(String), expect.any(Array), expect.any(Function));
        });

        it("should return an error if retrieval fails", async () => {
            db.query.mockImplementation((query, values, callback) => {
                callback(new Error("Fetch error"), null);
            });

            await expect(reminderService.getRemindersByDate()).rejects.toThrow("Fetch error");
        });
    });
});
