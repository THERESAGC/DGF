const request = require("supertest");
const express = require("express");
const profileService = require("../../services/profileService");
const { getEmployeeDetails } = require("../../controllers/profileController");

jest.mock("../../services/profileService");

const app = express();
app.use(express.json());
app.get("/employee/:id", getEmployeeDetails);

describe("getEmployeeDetails Controller", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    beforeEach(() => {
        jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
    });

    it("should return employee details when service call is successful", async () => {
        const mockEmployee = { id: "123", name: "John Doe", role: "Software Engineer" };
        profileService.getEmployeeDetailsById.mockResolvedValue(mockEmployee);

        const response = await request(app).get("/employee/123");

        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockEmployee);
        expect(profileService.getEmployeeDetailsById).toHaveBeenCalledWith("123");
    });

    it("should return 500 error when service call fails", async () => {
        profileService.getEmployeeDetailsById.mockRejectedValue(new Error("Database error"));

        const response = await request(app).get("/employee/123");

        expect(response.status).toBe(500);
        expect(response.body).toEqual({ message: "Error fetching employee details" });
        expect(profileService.getEmployeeDetailsById).toHaveBeenCalledWith("123");
    });
});
