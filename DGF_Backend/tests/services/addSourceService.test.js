const { addSource } = require("../../services/addSourceService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("addSourceService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should successfully insert a source into the database", async () => {
        const mockResults = { insertId: 101 };
        db.execute.mockImplementation((query, params, callback) => {
            callback(null, mockResults);
        });

        const result = await addSource("Internal Training");

        expect(db.execute).toHaveBeenCalledWith(
            "INSERT INTO source (source_name) VALUES (?)",
            ["Internal Training"],
            expect.any(Function)
        );
        expect(result).toEqual(mockResults);
    });

    it("should reject with an error if the database query fails", async () => {
        const mockError = new Error("Database error");
        db.execute.mockImplementation((query, params, callback) => {
            callback(mockError, null);
        });

        await expect(addSource("External Course")).rejects.toThrow("Database error");

        expect(db.execute).toHaveBeenCalledWith(
            "INSERT INTO source (source_name) VALUES (?)",
            ["External Course"],
            expect.any(Function)
        );
    });
});
