const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');
const connection = require('../config/db');  // Import the database connection

// Service method to export data to Excel
const exportToExcel = (callback) => {
  const query = `
    SELECT 
        nt.requestid AS 'Request No.', 
        pn.ProjectName AS 'Project Name', 
        CASE 
            WHEN nt.newprospectname IS NOT NULL THEN 'Y' 
            ELSE 'N' 
        END AS 'New Prospect (Y/N)',
        nt.newprospectname AS 'Prospect Name',
        c.course_name AS 'Course Name',
        emp.emp_name AS 'Employee Name',
        emp.emp_email AS 'Employee Mail Id',
        emp.designation_id AS 'Employee Designation',
        ac.status AS 'Course Status',
        ac.comments AS 'Comments',
        ac.status AS 'User Status',
        ac.learning_type AS 'Skill Type',
        ac.assigned_date AS 'Assigned Date',
        nt.expecteddeadline AS 'Expected Learning Completion Date',
        ac.completion_date AS 'Actual Learning Completion Date',
        ac.progress AS 'Progress',
        req_emp.emp_name AS 'Request Created By',
        req_emp.emp_email AS 'Request Created By Email',
        assigned_to_emp.emp_name AS 'Request Assigned To Name',
        emp_mentor.emp_name AS 'Course Assigned By',
        c.duration_hours AS 'Training Duration',
        emp_mentor.emp_name AS 'Faculty/Mentor Name',
        emp_mentor.emp_email AS 'Faculty/Mentor Mail Id',
        emp_mentor.designation_id AS 'Faculty/Mentor Designation',
        ct.type_name AS 'Course Type',
        CASE 
            WHEN nt.learningtype = 1 THEN 'Y'
            ELSE 'N'
        END AS 'Effectiveness Initiated (Y/N)',
        sd.service_name AS 'Service Division' 
    FROM 
        newtrainingrequest nt
    JOIN 
        assigned_courses ac ON nt.requestid = ac.requestid
    JOIN 
        employee emp ON ac.employee_id = emp.emp_id
    JOIN 
        employee emp_mentor ON ac.mentor_id = emp_mentor.emp_id
    JOIN 
        employee req_emp ON nt.requestedbyid = req_emp.emp_id
    JOIN 
        employee assigned_to_emp ON nt.requestedbyid = assigned_to_emp.emp_id
    JOIN 
        course c ON ac.course_id = c.course_id
    JOIN 
        course_type ct ON ac.coursetype_id = ct.type_id
    JOIN 
        projectname pn ON nt.projectid = pn.projectid
    JOIN 
        service_division sd ON nt.service_division = sd.id
    WHERE 
        ac.status IN ('Learning Initiated', 'Completed', 'Initiate Learning');
  `;

  // Execute the SQL query
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      callback(err, null);
      return;
    }

    // Create a new workbook
    const wb = XLSX.utils.book_new();

    // Convert query results to a worksheet
    const ws = XLSX.utils.json_to_sheet(results);

    // Set header row to be bold
    const headerRow = Object.keys(ws).filter(cell => cell[0] === 'A');
    headerRow.forEach(cell => {
      ws[cell].s = {
        font: {
          bold: true,  // Make the headers bold
          color: { rgb: 'FFFFFF' },  // Optional: Set font color for headers (white)
        },
        fill: {
          fgColor: { rgb: '4F81BD' },  // Optional: Set background color for headers (blue)
        },
      };
    });

    // Increase row height for the header row
    ws['!rows'] = [
      { hpt: 30 }, // Increase the row height for headers
    ];

    // Set column widths dynamically (you can adjust the pixel width as needed)
    const cols = [
      { wpx: 180 },
      { wpx: 250 },
      { wpx: 150 },
      { wpx: 150 },
      { wpx: 200 },
      { wpx: 180 },
      { wpx: 180 },
      { wpx: 180 },
      { wpx: 180 },
      { wpx: 150 },
      { wpx: 250 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 180 },
      { wpx: 180 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 150 },
      { wpx: 200 },
      { wpx: 200 },
      { wpx: 180 },
      { wpx: 250 },
      { wpx: 250 }, 
      { wpx: 250 }, 
      { wpx: 250 }, 
      { wpx: 250 }, 
      { wpx: 250 },   // Set larger width for the last column
    ];

    ws['!cols'] = cols;

    // Append the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Training Data');

    // Define the path where the file will be saved
    const filePath = path.join(__dirname, '../training_data.xlsx');

    // Write the workbook to a file
    XLSX.writeFile(wb, filePath);

    // Return the file path to the callback
    callback(null, filePath);
  });
};

module.exports = {
  exportToExcel
};

