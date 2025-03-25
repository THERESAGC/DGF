const fs = require('fs');
const path = require('path');
const connection = require('../../config/db');
const excelExportService = require('../../services/excelExportService');
const { exportExcel, getReportData } = require('../../controllers/excelExportController');

jest.mock('../../services/excelExportService');
jest.mock('fs');
jest.mock('../../config/db', () => ({
  promise: jest.fn().mockReturnValue({
    query: jest.fn(),
  }),
}));

describe('Excel Export Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { query: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      download: jest.fn((filePath, fileName, callback) => callback && callback(null)),
    };
    jest.spyOn(console, 'error').mockImplementation(() => {}); // Suppress console errors
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('exportExcel', () => {
    test('should return 400 if fromDate or toDate is missing', async () => {
      req.query = { fromDate: '2024-01-01' }; // Missing toDate

      await exportExcel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Both fromDate and toDate parameters are required',
      });
    });

    test('should return 400 if fromDate or toDate format is invalid', async () => {
      req.query = { fromDate: '2024/01/01', toDate: '2024-01-31' }; // Invalid format

      await exportExcel(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Invalid date format. Use YYYY-MM-DD',
      });
    });

    test('should return 500 if exportToExcel fails', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31', status: 'completed' };

      excelExportService.exportToExcel.mockImplementation((fromDate, toDate, status, callback) => {
        callback(new Error('Export error'), null);
      });

      await exportExcel(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Failed to generate report' }));
    });

    test('should call res.download if exportToExcel succeeds', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31' };
      const mockFilePath = '/path/to/file.xlsx';

      excelExportService.exportToExcel.mockImplementation((fromDate, toDate, status, callback) => {
        callback(null, { filePath: mockFilePath });
      });

      await exportExcel(req, res);

      expect(excelExportService.exportToExcel).toHaveBeenCalled();
      expect(res.download).toHaveBeenCalledWith(mockFilePath, 'training_report.xlsx', expect.any(Function));
    });

    test('should log error if res.download fails', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31' };
      const mockFilePath = '/path/to/file.xlsx';
      const downloadError = new Error('Download error');

      excelExportService.exportToExcel.mockImplementation((fromDate, toDate, status, callback) => {
        callback(null, { filePath: mockFilePath });
      });

      res.download.mockImplementationOnce((filePath, fileName, callback) => callback(downloadError));

      await exportExcel(req, res);

      expect(console.error).toHaveBeenCalledWith('Download failed:', downloadError);
    });

    test('should delete the file after download', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31' };
      const mockFilePath = '/path/to/file.xlsx';

      excelExportService.exportToExcel.mockImplementation((fromDate, toDate, status, callback) => {
        callback(null, { filePath: mockFilePath });
      });

      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {});

      await exportExcel(req, res);

      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
    });

    test('should log error if file cleanup fails', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31' };
      const mockFilePath = '/path/to/file.xlsx';
      const cleanupError = new Error('File cleanup error');
    
      excelExportService.exportToExcel.mockImplementation((fromDate, toDate, status, callback) => {
        callback(null, { filePath: mockFilePath });
      });
    
      fs.existsSync.mockReturnValue(true);
      fs.unlinkSync.mockImplementation(() => {
        throw cleanupError;
      });
    
      await exportExcel(req, res);
    
      expect(fs.existsSync).toHaveBeenCalledWith(mockFilePath);
      expect(fs.unlinkSync).toHaveBeenCalledWith(mockFilePath);
      expect(console.error).toHaveBeenCalledWith('File cleanup error:', cleanupError);
    });    

    test('should return 500 and log error if an unexpected error occurs', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31' };
      const unexpectedError = new Error('Unexpected error');
    
      excelExportService.exportToExcel.mockImplementation(() => {
        throw unexpectedError;
      });
    
      await exportExcel(req, res);
    
      expect(console.error).toHaveBeenCalledWith('Unexpected error:', unexpectedError);
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Internal server error',
        details: unexpectedError.message
      });
    });    
  });

  describe('getReportData', () => {
    test('should return 400 if fromDate or toDate is missing', async () => {
      req.query = { fromDate: '2024-01-01' }; // Missing toDate

      await getReportData(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        error: 'Both fromDate and toDate parameters are required',
      });
    });

    test('should return 500 if database query fails', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31', status: 'completed' };

      connection.promise().query.mockRejectedValue(new Error('Database error'));

      await getReportData(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ error: 'Failed to fetch report data' }));
    });

    test('should return report data successfully', async () => {
      req.query = { fromDate: '2024-01-01', toDate: '2024-01-31', status: 'all' };
      const mockResults = [
        {
          RequestID: 1,
          ProjectName: 'Project A',
          EmployeeName: 'John Doe',
          CourseStatus: 'Completed',
          AssignedDate: '2024-01-15',
          Progress: 100,
          CourseType: 'Technical',
        },
      ];

      connection.promise().query.mockResolvedValue([mockResults]);

      await getReportData(req, res);

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        count: mockResults.length,
        data: mockResults,
      });
    });
  });
});
