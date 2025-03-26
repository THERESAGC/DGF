const db = require("../../config/db");
const { deleteServiceDivision } = require("../../services/deleteServiceDivisionService");

jest.mock("../../config/db");

describe("deleteServiceDivisionService", () => {
  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test("should execute DELETE query with the correct ID", async () => {
    const id = 123;
    db.execute.mockResolvedValue();

    await deleteServiceDivision(id);

    expect(db.execute).toHaveBeenCalledWith("DELETE FROM service_division WHERE id = ?", [id]);
  });

  test("should throw an error when query execution fails", async () => {
    const id = 123;
    db.execute.mockRejectedValue(new Error("Database error"));

    await expect(deleteServiceDivision(id)).rejects.toThrow("Database error");

    expect(db.execute).toHaveBeenCalledWith("DELETE FROM service_division WHERE id = ?", [id]);
  });
});
