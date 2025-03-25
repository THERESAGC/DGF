const db = require("../../config/db");
const { addSeviceDivision } = require("../../services/addServiceDivisionService");

jest.mock("../../config/db");

describe("addServiceDivision Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("should resolve with insertId when service division is added successfully", async () => {
    const mockResult = [{ insertId: 1 }];
    db.execute = jest.fn((query, params, callback) => callback(null, mockResult));

    const result = await addSeviceDivision("IT Services");

    expect(db.execute).toHaveBeenCalledWith(
      "INSERT INTO service_division (service_name) VALUES (?)",
      ["IT Services"],
      expect.any(Function)
    );
    expect(result).toEqual(mockResult);
  });

  test("should reject with an error when database fails", async () => {
    const mockError = new Error("Database error");
    db.execute = jest.fn((query, params, callback) => callback(mockError, null));

    await expect(addSeviceDivision("IT Services")).rejects.toThrow("Database error");

    expect(db.execute).toHaveBeenCalledWith(
      "INSERT INTO service_division (service_name) VALUES (?)",
      ["IT Services"],
      expect.any(Function)
    );
  });
});
