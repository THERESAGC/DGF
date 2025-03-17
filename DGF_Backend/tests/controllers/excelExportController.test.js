const excelExportService = require('../../services/excelExportService');
const { exportExcelData } = require('../../controllers/excelExportController');

jest.mock('../../services/excelExportService');

describe('exportExcelData Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
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

  test('should return 500 if exportToExcel fails', () => {
    excelExportService.exportToExcel.mockImplementation((callback) => callback(new Error('Export error'), null));

    exportExcelData(req, res);

    expect(excelExportService.exportToExcel).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ message: 'Error generating Excel file' });
  });

  test('should call res.download if exportToExcel succeeds', () => {
    const mockFilePath = '/path/to/file.xlsx';
    excelExportService.exportToExcel.mockImplementation((callback) => callback(null, mockFilePath));

    exportExcelData(req, res);

    expect(excelExportService.exportToExcel).toHaveBeenCalled();
    expect(res.download).toHaveBeenCalledWith(mockFilePath, 'training_data.xlsx', expect.any(Function));
  });

  test('should log error if res.download fails', () => {
    const mockFilePath = '/path/to/file.xlsx';
    const downloadError = new Error('Download error');

    excelExportService.exportToExcel.mockImplementation((callback) => callback(null, mockFilePath));
    res.download.mockImplementationOnce((filePath, fileName, callback) => callback(downloadError));

    exportExcelData(req, res);

    expect(console.error).toHaveBeenCalledWith('Error downloading file:', downloadError);
  });
});
