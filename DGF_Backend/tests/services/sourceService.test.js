const db = require("../../config/db");
const { getAllSources } = require("../../services/sourceService");

jest.mock("../../config/db");

describe("getAllSources Service", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should return all sources when database query is successful", async () => {
        const mockSources = [
            { source_id: 1, source_name: "Internal Training" },
            { source_id: 2, source_name: "External Course" },
        ];
        db.execute.mockImplementation((query, callback) => {
            callback(null, mockSources);
        });

        const result = await getAllSources();
        expect(db.execute).toHaveBeenCalledWith("SELECT * FROM source", expect.any(Function));
        expect(result).toEqual(mockSources);
    });

    it("should reject with an error when database query fails", async () => {
        const mockError = new Error("Database error");
        db.execute.mockImplementation((query, callback) => {
            callback(mockError, null);
        });

        await expect(getAllSources()).rejects.toThrow("Database error");
        expect(db.execute).toHaveBeenCalledWith("SELECT * FROM source", expect.any(Function));
    });
});
