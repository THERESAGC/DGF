const db = require("../../config/db");
const { searchProjectsByName } = require("../../services/projectSearchService");

jest.mock("../../config/db");

describe("searchProjectsByName Service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  
  test("should return project list when query is successful", async () => {
    const mockResults = [{ ProjectID: 1, ProjectName: "Alpha" }];
    
    db.execute.mockImplementation((query, values, callback) => {
      callback(null, mockResults);
    });

    const result = await searchProjectsByName("A");
    expect(result).toEqual(mockResults);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), ["A%"], expect.any(Function));
  });

  test("should reject with an error when database query fails", async () => {
    const mockError = new Error("Database error");
    
    db.execute.mockImplementation((query, values, callback) => {
      callback(mockError, null);
    });

    await expect(searchProjectsByName("A")).rejects.toThrow("Database error");
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), ["A%"], expect.any(Function));
  });
});
