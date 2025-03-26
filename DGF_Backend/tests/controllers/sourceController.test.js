const sourceService = require("../../services/sourceService");
const { getAllSources } = require("../../controllers/sourceController");

jest.mock("../../services/sourceService");

describe("getAllSources Controller", () => {
    let mockRequest, mockResponse;

    beforeEach(() => {
        mockRequest = {};
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all sources when service call is successful", async () => {
        const mockSources = [
            { source_id: 1, source_name: "Internal Training" },
            { source_id: 2, source_name: "External Course" },
        ];
        sourceService.getAllSources.mockResolvedValue(mockSources);

        await getAllSources(mockRequest, mockResponse);

        expect(sourceService.getAllSources).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(200);
        expect(mockResponse.json).toHaveBeenCalledWith(mockSources);
    });

    it("should return 500 error when service call fails", async () => {
        const errorMessage = new Error("Database error");
        sourceService.getAllSources.mockRejectedValue(errorMessage);

        await getAllSources(mockRequest, mockResponse);

        expect(sourceService.getAllSources).toHaveBeenCalled();
        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({
            error: "Failed to retrieve sources",
            details: "Database error",
        });
    });
});
