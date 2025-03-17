const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const connection = require('../../config/db');
const { exportToExcel } = require('../../services/excelExportService');

jest.mock('fs');
jest.mock('path');
jest.mock('../../config/db', () => ({
  query: jest.fn(),
}));

jest.spyOn(XLSX.utils, 'book_new').mockReturnValue({});
jest.spyOn(XLSX.utils, 'json_to_sheet').mockReturnValue({});
jest.spyOn(XLSX.utils, 'book_append_sheet').mockImplementation(() => {});
jest.spyOn(XLSX, 'writeFile').mockImplementation(() => {});

describe('exportToExcel Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test('should return an error if the database query fails', (done) => {
    const mockError = new Error('Database query failed');
    connection.query.mockImplementationOnce((query, callback) => callback(mockError, null));

    exportToExcel((err, filePath) => {
      expect(err).toBe(mockError);
      expect(filePath).toBeNull();
      expect(connection.query).toHaveBeenCalled();
      done();
    });
  });

  test('should generate an Excel file successfully', (done) => {
    const mockResults = [{ requestid: 1, 'Project Name': 'Test Project' }];
    const mockFilePath = '/mock/path/training_data.xlsx';

    connection.query.mockImplementationOnce((query, callback) => callback(null, mockResults));
    path.join.mockReturnValue(mockFilePath);

    exportToExcel((err, filePath) => {
      expect(err).toBeNull();
      expect(filePath).toBe(mockFilePath);
      expect(connection.query).toHaveBeenCalled();
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      expect(XLSX.utils.json_to_sheet).toHaveBeenCalledWith(mockResults);
      expect(XLSX.utils.book_append_sheet).toHaveBeenCalled();
      expect(XLSX.writeFile).toHaveBeenCalledWith({}, mockFilePath);
      done();
    });
  });

  test('should apply styles to the header row', (done) => {
    const mockResults = [{ requestid: 1, 'Project Name': 'Test Project' }];
    const mockWorksheet = {
      A1: { v: 'Request No.' },
      B1: { v: 'Project Name' },
      A2: { v: '12345' },
      B2: { v: 'Test Project' },
      '!ref': 'A1:B2',
    };

    connection.query.mockImplementationOnce((query, callback) => callback(null, mockResults));
    jest.spyOn(XLSX.utils, 'json_to_sheet').mockReturnValue(mockWorksheet);

    exportToExcel((err) => {
      expect(err).toBeNull();

      // Ensure header row is extracted correctly
      const headerRow = Object.keys(mockWorksheet).filter(cell => cell[0] === 'A');
      expect(headerRow).toEqual(expect.arrayContaining(['A1']));

      // Ensure styles are applied to headers
      headerRow.forEach(cell => {
        expect(mockWorksheet[cell]).toHaveProperty('s');
        expect(mockWorksheet[cell].s.font).toEqual(expect.objectContaining({ bold: true }));
        expect(mockWorksheet[cell].s.fill).toEqual(expect.objectContaining({ fgColor: { rgb: '4F81BD' } }));
      });

      done();
    });
  });
});
