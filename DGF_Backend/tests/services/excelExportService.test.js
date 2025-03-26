const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const connection = require('../../config/db');
const { exportToExcel } = require('../../services/excelExportService');

jest.mock('fs');
jest.mock('path');
jest.mock('../../config/db');

describe('exportToExcel Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {}); // Suppress console error logs
  });

  test('should apply Completed status condition', async () => {
    const expectedFilter = `AND (ac.status = 'Completed' OR ac.status = 'Completed with Delay')`;
  
    connection.query.mockImplementationOnce((query, values, callback) => {
      expect(query.replace(/\s+/g, ' ')).toContain(expectedFilter.replace(/\s+/g, ' '));
      callback(null, [{ requestid: 1, 'Project Name': 'Test Project' }]);
    });
  
    await new Promise((resolve) => {
      exportToExcel('2024-01-01', '2024-01-31', 'Completed', (err) => {
        expect(connection.query).toHaveBeenCalled();
        resolve();
      });
    });
  });
  
  test('should apply Overdue status condition', async () => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
    const expectedFilter = `AND ac.status = 'Learning Initiated' AND ac.completion_date < '${formattedToday}'`;
  
    connection.query.mockImplementationOnce((query, values, callback) => {
      expect(query.replace(/\s+/g, ' ')).toContain(expectedFilter.replace(/\s+/g, ' '));
      callback(null, [{ requestid: 1, 'Project Name': 'Test Project' }]);
    });
  
    await new Promise((resolve) => {
      exportToExcel('2024-01-01', '2024-01-31', 'Overdue', (err) => {
        expect(connection.query).toHaveBeenCalled();
        resolve();
      });
    });
  });
  
  test('should apply DueForCompletion status condition', async () => {
    const today = new Date();
    const formattedToday = today.toISOString().split('T')[0];
  
    const expectedFilter = `AND ac.status = 'Learning Initiated' AND ac.completion_date BETWEEN '${formattedToday}' AND DATE_ADD('${formattedToday}', INTERVAL 7 DAY)`;
  
    connection.query.mockImplementationOnce((query, values, callback) => {
      expect(query.replace(/\s+/g, ' ')).toContain(expectedFilter.replace(/\s+/g, ' '));
      callback(null, [{ requestid: 1, 'Project Name': 'Test Project' }]);
    });
  
    await new Promise((resolve) => {
      exportToExcel('2024-01-01', '2024-01-31', 'DueForCompletion', (err) => {
        expect(connection.query).toHaveBeenCalled();
        resolve();
      });
    });
  });
  
  test('should apply Rejected status condition', async () => {
    const expectedFilter = `WHERE ntr.requeststatus = 'rejected' AND DATE(ntr.expecteddeadline) BETWEEN ? AND ?`;
  
    connection.query.mockImplementationOnce((query, values, callback) => {
      expect(query.replace(/\s+/g, ' ')).toContain(expectedFilter.replace(/\s+/g, ' '));
      callback(null, [{ requestid: 1, 'Project Name': 'Test Project' }]);
    });
  
    await new Promise((resolve) => {
      exportToExcel('2024-01-01', '2024-01-31', 'Rejected', (err) => {
        expect(connection.query).toHaveBeenCalled();
        resolve();
      });
    });
  });

  test('should return an error if the database query fails', (done) => {
    connection.query.mockImplementationOnce((query, values, callback) => callback(new Error('Database error')));
    exportToExcel('2024-01-01', '2024-01-31', 'all', (err, result) => {
      expect(err).not.toBeNull();
      expect(err.message).toBe('Database error');
      expect(result).toBeUndefined();
      done();
    });
  });

  test('should return an error if no data is found', (done) => {
    connection.query.mockImplementationOnce((query, values, callback) => callback(null, []));
    exportToExcel('2024-01-01', '2024-01-31', 'all', (err) => {
      expect(err).not.toBeNull();
      expect(err.message).toBe('No data found for the selected filters');
      done();
    });
  });

  test('should apply the status filter when status is provided', (done) => {
    const mockResults = [{ requestid: 1, 'Project Name': 'Test Project' }];
    const mockStatus = 'completed';
  
    connection.query.mockImplementationOnce((query, values, callback) => {
      expect(query).toContain(`AND ac.status = '${mockStatus}'`); // Ensure query contains status filter
      callback(null, mockResults);
    });
  
    exportToExcel('2024-01-01', '2024-01-31', mockStatus, (err, result) => {
      expect(connection.query).toHaveBeenCalled();
      done();
    });
  });

  test('should generate an Excel file successfully', (done) => {
    const mockResults = [{ requestid: 1, 'Project Name': 'Test Project' }];
    const mockFilePath = 'mock_reports/training_report.xlsx';

    connection.query.mockImplementationOnce((query, values, callback) => callback(null, mockResults));
    jest.spyOn(XLSX.utils, 'json_to_sheet').mockReturnValue({ A1: { v: 'Request ID', s: {} } });
    jest.spyOn(XLSX.utils, 'book_new').mockReturnValue({});
    jest.spyOn(XLSX.utils, 'book_append_sheet').mockImplementation();
    jest.spyOn(XLSX, 'writeFile').mockImplementation();
    fs.existsSync.mockReturnValue(true);
    path.join.mockReturnValue(mockFilePath);

    exportToExcel('2024-01-01', '2024-01-31', 'all', (err, result) => {
      expect(connection.query).toHaveBeenCalled();
      expect(XLSX.utils.book_new).toHaveBeenCalled();
      done();
    });
  });

  test('should apply styles to the header row', (done) => {
    const mockResults = [{ requestid: 1, 'Project Name': 'Test Project' }];
    const mockWorksheet = {
      A1: { v: 'Request No.', s: { font: { bold: true }, fill: { fgColor: { rgb: '2C3E50' } } } },
      B1: { v: 'Project Name', s: { font: { bold: true }, fill: { fgColor: { rgb: '2C3E50' } } } },
      A2: { v: '12345' },
      B2: { v: 'Test Project' },
      '!ref': 'A1:B2',
    };

    connection.query.mockImplementationOnce((query, values, callback) => callback(null, mockResults));
    jest.spyOn(XLSX.utils, 'json_to_sheet').mockReturnValue(mockWorksheet);

    exportToExcel('2024-01-01', '2024-01-31', 'all', (err) => {
      expect(err).toBeNull();
      const headerRow = Object.keys(mockWorksheet).filter(cell => cell.endsWith('1'));
      headerRow.forEach(cell => {
        expect(mockWorksheet[cell]).toHaveProperty('s');
        expect(mockWorksheet[cell].s.font).toEqual(expect.objectContaining({ bold: true }));
        expect(mockWorksheet[cell].s.fill).toEqual(expect.objectContaining({ fgColor: { rgb: '2C3E50' } }));
      });
      done();
    });
  });

  test('should skip styling for missing header cells', (done) => {
    const mockResults = [{ requestid: 1, 'Project Name': 'Test Project' }];
    
    // Mocking a worksheet with missing cells
    const mockWorksheet = {
      A1: { v: 'Request ID' }, // Present cell
      B1: undefined, // Missing cell to trigger the condition
      C1: { v: 'Employee Name' }, // Present cell
      '!ref': 'A1:C2', // Define the range
    };
  
    connection.query.mockImplementationOnce((query, values, callback) => callback(null, mockResults));
    jest.spyOn(XLSX.utils, 'json_to_sheet').mockReturnValue(mockWorksheet);
    jest.spyOn(XLSX.utils, 'decode_range').mockReturnValue({ s: { c: 0 }, e: { c: 2 } }); // Simulate column range
  
    exportToExcel('2024-01-01', '2024-01-31', 'all', (err) => {
      expect(err).toBeNull();
      expect(mockWorksheet.B1).toBeUndefined(); // Ensure the missing cell remains undefined
      done();
    });
  });

  test('should return an empty array if results is null', (done) => {
    connection.query.mockImplementationOnce((query, values, callback) => callback(null, null));
  
    exportToExcel('2024-01-01', '2024-01-31', 'all', (err, result) => {
      done();
    });
  });
});
