const { searchCoursesByName } = require('../../services/courseSearchService');
const db = require('../../config/db');

jest.mock('../../config/db', () => ({
  execute: jest.fn(),
}));

describe('courseSearchService', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return an error if database query fails', async () => {
    db.execute.mockImplementation((query, values, callback) => callback(new Error('DB error'), null));

    await expect(searchCoursesByName('Java')).rejects.toThrow('DB error');
  });

  test('should return matching courses successfully', async () => {
    const mockCourses = [
      { course_id: 1, course_name: 'Java Basics', course_description: 'Intro to Java', duration_hours: 10, created_date: '2025-03-08' },
      { course_id: 2, course_name: 'Java Advanced', course_description: 'Advanced Java concepts', duration_hours: 15, created_date: '2025-03-08' },
    ];

    db.execute.mockImplementation((query, values, callback) => callback(null, mockCourses));

    await expect(searchCoursesByName('Java')).resolves.toEqual(mockCourses);
  });

  test('should return an empty array when no courses match the search query', async () => {
    db.execute.mockImplementation((query, values, callback) => callback(null, []));

    await expect(searchCoursesByName('NonExistentCourse')).resolves.toEqual([]);
  });
});
