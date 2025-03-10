const { getAllCourseTypes } = require('../../services/courseTypeService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('getAllCourseTypes Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should retrieve all course types successfully', async () => {
    const mockCourseTypes = [
      { type_id: 1, type_name: 'Technical', type_description: 'Technical courses' },
      { type_id: 2, type_name: 'Soft Skills', type_description: 'Courses for soft skills' },
    ];

    db.execute.mockImplementation((query, callback) => {
      callback(null, mockCourseTypes);
    });

    const result = await getAllCourseTypes();

    expect(result).toEqual(mockCourseTypes);
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });

  test('should handle database errors', async () => {
    db.execute.mockImplementation((query, callback) => {
      callback(new Error('Database error'), null);
    });

    await expect(getAllCourseTypes()).rejects.toThrow('Database error');
    expect(db.execute).toHaveBeenCalledWith(expect.any(String), expect.any(Function));
  });
});
