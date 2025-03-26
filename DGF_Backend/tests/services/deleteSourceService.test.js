const { deleteSourceService } = require("../../services/deleteSourceService");
const db = require("../../config/db");

jest.mock("../../config/db");

describe("deleteSourceService", () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should delete a source successfully", async () => {
        db.execute.mockResolvedValue([{}]);

        await deleteSourceService("123");

        expect(db.execute).toHaveBeenCalledWith("DELETE FROM source WHERE source_id = ?", ["123"]);
    });

    it("should throw an error if database execution fails", async () => {
        const mockError = new Error("Database error");
        db.execute.mockRejectedValue(mockError);

        await expect(deleteSourceService("123")).rejects.toThrow("Database error");
    });
});
