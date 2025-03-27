import { jsPDF } from "jspdf"
import "jspdf-autotable"
import * as XLSX from "xlsx"

/**
 * Utility functions for exporting data to different formats
 */

/**
 * Format feedback data for export
 * @param {Array} data - The feedback data to format
 * @returns {Array} - Formatted data for export
 */
const formatFeedbackData = (data) => {
  return data.map((item) => ({
    "Employee ID": item.employee_id || "",
    "Employee Name": item.emp_name || "",
    "Employee Email": item.emp_email || "",
    "Course ID": item.course_id || "",
    "Training Topic": item.training_topic || "",
    "Request ID": item.reqid || "",
    "Instruction Rating": mapRatingToText("instruction_rating", item.instruction_rating) || "",
    "Engagement Rating": mapRatingToText("engaged_rating", item.engaged_rating) || "",
    "Program Engaging": mapRatingToText("interactive", item.interactive) || "",
    "Interaction Level": mapRatingToText("interactive_components", item.interactive_components) || "",
    "Overall Experience": mapRatingToText("engaged_session_rating", item.engaged_session_rating) || "",
    "Areas for Improvement": item.improved_comments || "",
    "Other Suggestions": item.other_suggestions || "",
    Date: formatDate(item.created_at || item.date || new Date()),
  }))
}

/**
 * Format date for display
 * @param {Date|string} date - The date to format
 * @returns {string} - Formatted date string
 */
const formatDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString()
}

/**
 * Map numeric ratings to text
 * @param {string} field - The field name
 * @param {string|number} value - The rating value
 * @returns {string} - The text representation of the rating
 */
const mapRatingToText = (field, value) => {
  const mappings = {
    instruction_rating: {
      4: "Very Good",
      3: "Good",
      2: "Interesting",
      1: "Average",
    },
    engaged_rating: {
      4: "Very Good",
      3: "Good",
      2: "Interesting",
      1: "Average",
    },
    interactive: {
      2: "Yes",
      1: "No",
    },
    interactive_components: {
      3: "More",
      2: "Less",
      1: "Some",
    },
    engaged_session_rating: {
      4: "Very Good",
      3: "Good",
      2: "Interesting",
      1: "Average",
    },
  }

  return mappings[field]?.[value] || value
}

/**
 * Export data to Excel format
 * @param {Array} data - The data to export
 * @param {string} fileName - The name of the file to download
 */
export const exportToExcel = (data, fileName = "feedback_report") => {
  const formattedData = formatFeedbackData(data)

  // Create a new workbook
  const wb = XLSX.utils.book_new()

  // Convert data to worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData)

  // Add worksheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Feedback Data")

  // Generate Excel file and trigger download
  XLSX.writeFile(wb, `${fileName}_${new Date().toISOString().split("T")[0]}.xlsx`)
}

/**
 * Export data to CSV format
 * @param {Array} data - The data to export
 * @param {string} fileName - The name of the file to download
 */
export const exportToCSV = (data, fileName = "feedback_report") => {
  const formattedData = formatFeedbackData(data)

  // Get headers from the first object
  const headers = Object.keys(formattedData[0])

  // Create CSV content
  let csvContent = headers.join(",") + "\n"

  // Add data rows
  formattedData.forEach((item) => {
    const row = headers
      .map((header) => {
        // Escape quotes and wrap in quotes if the value contains commas or quotes
        const value = String(item[header] || "")
        const escapedValue = value.replace(/"/g, '""')
        return value.includes(",") || value.includes('"') ? `"${escapedValue}"` : escapedValue
      })
      .join(",")
    csvContent += row + "\n"
  })

  // Create a Blob with the CSV content
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })

  // Create a download link
  const link = document.createElement("a")
  const url = URL.createObjectURL(blob)
  link.setAttribute("href", url)
  link.setAttribute("download", `${fileName}_${new Date().toISOString().split("T")[0]}.csv`)
  link.style.visibility = "hidden"

  // Append to document, trigger download, and clean up
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Export data to PDF format
 * @param {Array} data - The data to export
 * @param {string} fileName - The name of the file to download
 */
export const exportToPDF = (data, fileName = "feedback_report") => {
  const formattedData = formatFeedbackData(data)

  // Create a new PDF document
  const doc = new jsPDF("landscape")

  // Add title
  doc.setFontSize(18)
  doc.text("Feedback Report", 14, 22)
  doc.setFontSize(11)
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30)

  // Define the columns for the table
  const columns = [
    { header: "Employee", dataKey: "Employee Name" },
    { header: "Training Topic", dataKey: "Training Topic" },
    { header: "Instruction", dataKey: "Instruction Rating" },
    { header: "Engagement", dataKey: "Engagement Rating" },
    { header: "Overall", dataKey: "Overall Experience" },
    { header: "Program Engaging", dataKey: "Program Engaging" },
  ]

  // Prepare the data for the table
  const tableData = formattedData.map((item) => {
    const row = {}
    columns.forEach((col) => {
      row[col.dataKey] = item[col.dataKey]
    })
    return row
  })

  // Add the table to the PDF
  doc.autoTable({
    startY: 40,
    head: [columns.map((col) => col.header)],
    body: tableData.map((item) => columns.map((col) => item[col.dataKey])),
    theme: "grid",
    styles: {
      fontSize: 8,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [9, 69, 158],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  })

  // Add a second table for comments if there's space
  if (formattedData.length > 0) {
    const commentColumns = [
      { header: "Employee", dataKey: "Employee Name" },
      { header: "Areas for Improvement", dataKey: "Areas for Improvement" },
      { header: "Other Suggestions", dataKey: "Other Suggestions" },
    ]

    doc.addPage()
    doc.setFontSize(14)
    doc.text("Feedback Comments", 14, 22)

    doc.autoTable({
      startY: 30,
      head: [commentColumns.map((col) => col.header)],
      body: formattedData.map((item) => commentColumns.map((col) => item[col.dataKey])),
      theme: "grid",
      styles: {
        fontSize: 8,
        cellPadding: 3,
        overflow: "linebreak",
      },
      headStyles: {
        fillColor: [9, 69, 158],
        textColor: [255, 255, 255],
        fontStyle: "bold",
      },
      columnStyles: {
        1: { cellWidth: "auto" },
        2: { cellWidth: "auto" },
      },
    })
  }

  // Save the PDF
  doc.save(`${fileName}_${new Date().toISOString().split("T")[0]}.pdf`)
}

/**
 * Export data to the specified format
 * @param {Array} data - The data to export
 * @param {string} format - The format to export to (xlsx, csv, pdf)
 * @param {string} fileName - The name of the file to download
 */
export const exportData = (data, format, fileName = "feedback_report") => {
  switch (format.toLowerCase()) {
    case "xlsx":
      exportToExcel(data, fileName)
      break
    case "csv":
      exportToCSV(data, fileName)
      break
    case "pdf":
      exportToPDF(data, fileName)
      break
    default:
      console.error(`Unsupported export format: ${format}`)
  }
}

