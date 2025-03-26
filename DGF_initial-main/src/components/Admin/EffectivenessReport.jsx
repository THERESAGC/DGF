import { useState } from "react"
import {
  Box,
  Typography,
  Button,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Alert,
  Pagination,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { Download, Refresh } from "@mui/icons-material"

// Custom CSS for calendar
// import "./calendar-styles.css"

const effectivenessFilters = [
  { value: "all", label: "All" },
  { value: "Excellent", label: "Excellent" },
  { value: "Good", label: "Good" },
  { value: "Average", label: "Average" },
  { value: "Poor", label: "Poor" },
]

const getEffectivenessColor = (rating) => {
  switch (rating) {
    case "Excellent":
      return "#4CAF50"
    case "Good":
      return "#2196F3"
    case "Average":
      return "#FFC107"
    case "Poor":
      return "#F44336"
    default:
      return "#757575"
  }
}

const rowsPerPage = 5

const EffectivenessReport = () => {
  const [fromDate, setFromDate] = useState(null)
  const [toDate, setToDate] = useState(null)
  const [reportData, setReportData] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedRating, setSelectedRating] = useState("all")
  const [page, setPage] = useState(1)
  const [noDataMessage, setNoDataMessage] = useState(null)

  const handleViewReport = async () => {
    if (!fromDate || !toDate) {
      setError("Please select both start and end dates")
      setNoDataMessage(null)
      return
    }

    setLoading(true)
    setError(null)
    setNoDataMessage(null)

    try {
      const from = fromDate.toISOString().split("T")[0]
      const to = toDate.toISOString().split("T")[0]

      // Mock API call - replace with actual endpoint
      // const response = await axios.get(
      //   `http://localhost:8000/api/effectiveness/data?fromDate=${from}&toDate=${to}&rating=${selectedRating}`
      // )

      // For demo purposes, generate mock data
      const mockData = generateMockData()
      setReportData(mockData)
      setPage(1)
    } catch (err) {
      console.error("Error:", err)
      setError(err.message || "Failed to load effectiveness report")
      setReportData([])
    } finally {
      setLoading(false)
    }
  }

  const generateMockData = () => {
    const ratings = ["Excellent", "Good", "Average", "Poor"]
    const applications = ["Real-world application", "Partial application", "Limited application", "No application"]
    const improvements = ["Significant improvement", "Moderate improvement", "Slight improvement", "No improvement"]

    return Array.from({ length: 25 }, (_, i) => ({
      "Feedback ID": 1000 + i,
      "Request ID": 2000 + Math.floor(i / 3),
      "Course Name": `Course ${["Python Advanced", "React Fundamentals", "Data Science", "Cloud Architecture", "UI/UX Design"][i % 5]}`,
      "Employee Name": `Employee ${100 + i}`,
      "Employee Email": `employee${100 + i}@example.com`,
      "Feedback Date": new Date(2023, 5 + Math.floor(i / 10), 1 + (i % 28)).toISOString().split("T")[0],
      "Overall Rating": ratings[i % 4],
      "Knowledge Application": applications[i % 4],
      "Performance Improvement": improvements[i % 4],
      "Manager Name": `Manager ${200 + Math.floor(i / 5)}`,
      "Manager Comments": `This is a ${["detailed", "brief", "comprehensive", "short"][i % 4]} feedback comment from the manager.`,
      "Feedback Comments": `The training was ${["very helpful", "somewhat helpful", "not very helpful", "excellent"][i % 4]} for my role.`,
    }))
  }

  const handleExport = () => {
    const from = fromDate?.toISOString().split("T")[0] || ""
    const to = toDate?.toISOString().split("T")[0] || ""
    window.location.href = `http://localhost:8000/api/export-effectiveness?fromDate=${from}&toDate=${to}&rating=${selectedRating}`
  }

  const handleRatingFilter = (event, newRating) => {
    if (newRating !== null) {
      setSelectedRating(newRating)
    }
  }

  const handleClearFilters = () => {
    setFromDate(null)
    setToDate(null)
    setSelectedRating("all")
    setReportData([])
    setError(null)
    setNoDataMessage(null)
  }

  const handlePageChange = (event, newPage) => {
    setPage(newPage)
  }

  // Calculate pagination values
  const startIndex = reportData.length === 0 ? 0 : (page - 1) * rowsPerPage + 1
  const endIndex = Math.min(page * rowsPerPage, reportData.length)

  // Get current page data
  const paginatedData = reportData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  // Filter data based on selected rating
  const filteredData =
    selectedRating === "all" ? paginatedData : paginatedData.filter((item) => item["Overall Rating"] === selectedRating)

  return (
    <Paper elevation={3} sx={{ p: 4, bgcolor: "background.paper", maxWidth: "100%", borderRadius: "15px" }}>
      <Typography
        variant="h5"
        gutterBottom
        sx={{
          mb: 3,
          fontWeight: "600",
          color: "primary.main",
          textAlign: "left",
        }}
      >
        Effectiveness Report
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {noDataMessage && (
        <Alert severity="info" sx={{ mb: 3 }}>
          {noDataMessage}
        </Alert>
      )}

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Stack spacing={3} sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              gap: 3,
              flexWrap: "wrap",
            }}
          >
            {/* Date picker styling */}
            <Box sx={{ flex: 1, minWidth: 180, maxWidth: 220 }}>
              <Typography variant="body2" sx={{ mb: 1, color: "#4F4949", fontWeight: 500 }}>
                Start Date
              </Typography>
              <DatePicker
                value={fromDate}
                onChange={setFromDate}
                format="MM/dd/yyyy"
                className="small-calendar"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      "& .MuiInputBase-root": {
                        height: "30px",
                        fontSize: "12px",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                          borderRadius: "4px",
                        },
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    },
                  },
                  desktopPaper: {
                    sx: {
                      "& .MuiPickersDay-root": {
                        fontSize: "0.75rem",
                        width: 28,
                        height: 28,
                        margin: "1px",
                      },
                      "& .MuiDayCalendar-header": {
                        "& .MuiTypography-root": {
                          fontSize: "0.7rem",
                        },
                      },
                      "& .MuiPickersCalendarHeader-label": {
                        fontSize: "0.85rem",
                      },
                    },
                  },
                }}
              />
            </Box>

            <Box sx={{ flex: 1, minWidth: 180, maxWidth: 220 }}>
              <Typography variant="body2" sx={{ mb: 1, color: "#4F4949", fontWeight: 500 }}>
                End Date
              </Typography>
              <DatePicker
                value={toDate}
                onChange={setToDate}
                minDate={fromDate}
                format="MM/dd/yyyy"
                className="small-calendar"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    size: "small",
                    sx: {
                      "& .MuiInputBase-root": {
                        height: "30px",
                        fontSize: "12px",
                      },
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": {
                          borderColor: "rgba(0, 0, 0, 0.23)",
                          borderRadius: "4px",
                        },
                        "&:hover fieldset": {
                          borderColor: "primary.main",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "primary.main",
                        },
                      },
                    },
                  },
                  desktopPaper: {
                    sx: {
                      "& .MuiPickersDay-root": {
                        fontSize: "0.75rem",
                        width: 28,
                        height: 28,
                        margin: "1px",
                      },
                      "& .MuiDayCalendar-header": {
                        "& .MuiTypography-root": {
                          fontSize: "0.7rem",
                        },
                      },
                      "& .MuiPickersCalendarHeader-label": {
                        fontSize: "0.85rem",
                      },
                    },
                  },
                }}
              />
            </Box>
          </Box>

          <ToggleButtonGroup
            value={selectedRating}
            exclusive
            onChange={handleRatingFilter}
            size="small"
            sx={{
              flexWrap: "wrap",
              gap: 1,
              "& .MuiToggleButton-root": {
                px: 1.5,
                py: 0.5,
                fontSize: "0.8125rem",
                borderRadius: "4px !important",
                border: "1px solid",
                borderColor: "divider",
                textTransform: "none",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": { bgcolor: "primary.dark" },
                },
              },
            }}
          >
            {effectivenessFilters.map((filter) => (
              <ToggleButton key={filter.value} value={filter.value} disabled={loading}>
                {filter.label}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Stack>
      </LocalizationProvider>

      <Stack direction="row" spacing={2} sx={{ mb: 4 }}>
        <Button
          variant="contained"
          onClick={handleViewReport}
          disabled={!fromDate || !toDate || loading}
          startIcon={<Refresh />}
          size="small"
          sx={{
            px: 3,
            textTransform: "none",
            fontWeight: "500",
          }}
        >
          {loading ? "Loading..." : "Generate Report"}
        </Button>

        <Button
          variant="outlined"
          onClick={handleExport}
          disabled={reportData.length === 0 || loading}
          startIcon={<Download />}
          size="small"
          sx={{
            px: 3,
            textTransform: "none",
            fontWeight: "500",
          }}
        >
          Export to Excel
        </Button>

        <Button
          variant="text"
          onClick={handleClearFilters}
          disabled={loading}
          size="small"
          sx={{
            textTransform: "none",
            fontWeight: "500",
          }}
        >
          Clear Filters
        </Button>
      </Stack>

      {reportData.length > 0 && (
        <div>
          <TableContainer
            component={Paper}
            sx={{
              maxHeight: 500,
              width: "98.5%",
              borderColor: "divider",
              mb: 2,
              boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
              "& .MuiTableCell-root": {
                fontSize: "12px !important",
              },
            }}
          >
            <Table stickyHeader size="small" sx={{ padding: "0px" }}>
              <TableHead>
                <TableRow sx={{ borderBottom: "5px solid #8FBEF8" }}>
                  <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Feedback ID</TableCell>
                  <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Request ID</TableCell>
                  <TableCell sx={{ minWidth: 150, fontWeight: "600", backgroundColor: "white" }}>Course Name</TableCell>
                  <TableCell sx={{ minWidth: 150, fontWeight: "600", backgroundColor: "white" }}>
                    Employee Name
                  </TableCell>
                  <TableCell sx={{ minWidth: 180, fontWeight: "600", backgroundColor: "white" }}>
                    Employee Email
                  </TableCell>
                  <TableCell sx={{ minWidth: 120, fontWeight: "600", backgroundColor: "white" }}>
                    Feedback Date
                  </TableCell>
                  <TableCell sx={{ minWidth: 120, fontWeight: "600", backgroundColor: "white" }}>
                    Overall Rating
                  </TableCell>
                  <TableCell sx={{ minWidth: 180, fontWeight: "600", backgroundColor: "white" }}>
                    Knowledge Application
                  </TableCell>
                  <TableCell sx={{ minWidth: 180, fontWeight: "600", backgroundColor: "white" }}>
                    Performance Improvement
                  </TableCell>
                  <TableCell sx={{ minWidth: 150, fontWeight: "600", backgroundColor: "white" }}>
                    Manager Name
                  </TableCell>
                  <TableCell sx={{ minWidth: 200, fontWeight: "600", backgroundColor: "white" }}>
                    Manager Comments
                  </TableCell>
                  <TableCell sx={{ minWidth: 200, fontWeight: "600", backgroundColor: "white" }}>
                    Feedback Comments
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <TableRow
                      key={`row-${row["Feedback ID"]}-${index}`}
                      sx={{ backgroundColor: index % 2 === 0 ? "#F1F2FD" : "white" }}
                    >
                      <TableCell>{row["Feedback ID"]}</TableCell>
                      <TableCell>{row["Request ID"]}</TableCell>
                      <TableCell>{row["Course Name"]}</TableCell>
                      <TableCell>{row["Employee Name"]}</TableCell>
                      <TableCell>{row["Employee Email"]}</TableCell>
                      <TableCell>{row["Feedback Date"]}</TableCell>
                      <TableCell>
                        <Box sx={{ color: getEffectivenessColor(row["Overall Rating"]), fontWeight: "500" }}>
                          {row["Overall Rating"]}
                        </Box>
                      </TableCell>
                      <TableCell>{row["Knowledge Application"]}</TableCell>
                      <TableCell>{row["Performance Improvement"]}</TableCell>
                      <TableCell>{row["Manager Name"]}</TableCell>
                      <TableCell>{row["Manager Comments"]}</TableCell>
                      <TableCell>{row["Feedback Comments"]}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={12} align="center" sx={{ py: 3 }}>
                      No records to display for this page
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderTop: "1px solid",
              borderColor: "divider",
            }}
          >
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: "inherit" }}>
              {reportData.length === 0
                ? "No records"
                : `Showing ${startIndex}-${endIndex} of ${reportData.length} records`}
            </Typography>
            <Pagination
              count={Math.ceil(reportData.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              size="small"
              shape="rounded"
              sx={{
                "& .MuiPaginationItem-root": {
                  fontWeight: 500,
                  "&.Mui-selected": {
                    borderRadius: "50%",
                    color: "red",
                  },
                },
              }}
            />
          </Box>
        </div>
      )}
    </Paper>
  )
}

export default EffectivenessReport

