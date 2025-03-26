const request = require("supertest");
const express = require("express");
const reminderController = require("../../controllers/inititateTrainingRemindersController");
const reminderService = require("../../services/inititateTrainingRemindersService");

jest.mock("../../services/inititateTrainingRemindersService");

const app = express();
app.use(express.json());
app.post("/reminders", reminderController.createReminder);
app.delete("/reminders/:reminder_id", reminderController.deleteReminder);
app.put("/reminders/:reminder_id", reminderController.updateReminder);
app.get("/reminders", reminderController.getRemindersByDate);

describe("Training Reminders Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe("createReminder", () => {
        it("should create a reminder successfully", async () => {
            reminderService.createReminder.mockResolvedValue();

            const response = await request(app)
                .post("/reminders")
                .send({ title: "Reminder 1", date: "2025-03-30" });

            expect(response.status).toBe(201);
            expect(response.body.message).toBe("Reminder created successfully");
            expect(reminderService.createReminder).toHaveBeenCalledWith({ title: "Reminder 1", date: "2025-03-30" });
        });

        it("should return 500 on error", async () => {
            reminderService.createReminder.mockRejectedValue(new Error("Database error"));

            const response = await request(app).post("/reminders").send({ title: "Reminder 1" });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Database error");
        });
    });

    describe("deleteReminder", () => {
        it("should delete a reminder successfully", async () => {
            reminderService.deleteReminder.mockResolvedValue();

            const response = await request(app).delete("/reminders/1");

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Reminder deleted successfully");
            expect(reminderService.deleteReminder).toHaveBeenCalledWith("1");
        });

        it("should return 500 on error", async () => {
            reminderService.deleteReminder.mockRejectedValue(new Error("Delete error"));

            const response = await request(app).delete("/reminders/1");

            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Delete error");
        });
    });

    describe("updateReminder", () => {
        it("should update a reminder successfully", async () => {
            reminderService.updateReminder.mockResolvedValue();

            const response = await request(app)
                .put("/reminders/1")
                .send({ title: "Updated Reminder" });

            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Reminder updated successfully");
            expect(reminderService.updateReminder).toHaveBeenCalledWith("1", { title: "Updated Reminder" });
        });

        it("should return 500 on error", async () => {
            reminderService.updateReminder.mockRejectedValue(new Error("Update error"));

            const response = await request(app).put("/reminders/1").send({ title: "Updated Reminder" });

            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Update error");
        });
    });

    describe("getRemindersByDate", () => {
        it("should retrieve reminders successfully", async () => {
            const mockReminders = [{ id: 1, title: "Reminder 1", date: "2025-03-30" }];
            reminderService.getRemindersByDate.mockResolvedValue(mockReminders);

            const response = await request(app).get("/reminders");

            expect(response.status).toBe(200);
            expect(response.body).toEqual(mockReminders);
        });

        it("should return 500 on error", async () => {
            reminderService.getRemindersByDate.mockRejectedValue(new Error("Fetch error"));

            const response = await request(app).get("/reminders");

            expect(response.status).toBe(500);
            expect(response.body.error).toBe("Fetch error");
        });
    });
});
