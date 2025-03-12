// controllers/excelExportController.js

const excelExportService = require('../services/excelExportService'); // Import the excel export service

// Controller method to handle the export request
const exportExcelData = (req, res) => {
  excelExportService.exportToExcel((err, filePath) => {
    if (err) {
      return res.status(500).json({ message: 'Error generating Excel file' });
    }

    // Send the generated Excel file to the client
    res.download(filePath, 'training_data.xlsx', (err) => {
      if (err) {
        console.error('Error downloading file:', err);
      }
      
      // Optionally, delete the file after sending
    //   fs.unlinkSync(filePath);
    });
  });
};

module.exports = {
  exportExcelData
};
