import { useState, useEffect } from "react"
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  Button,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  ToggleButton,
  ToggleButtonGroup,
  Alert,
  Pagination,
} from "@mui/material"

import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { Download, Refresh } from "@mui/icons-material"

import FeedbackDashboard from "./feedback-dashboard"
import ManagerFeedbackDashboard from "./manager-feedback-dashboard"
// import "./calendar-styles.css"

const statusFilters = [
  { value: "all", label: "All" },
  { value: "Completed", label: "Completed" },
  { value: "Learning Initiated", label: "Learning Initiated" },
  { value: "Overdue", label: "Over Due/Past Due" },
  { value: "DueForCompletion", label: "Due for completion" },
  { value: "Learning Suspended", label: "Suspended" },
  { value: "Completed with Delay", label: "Delayed" },
  { value: "Incomplete", label: "Incomplete" },
  { value: "Rejected", label: "Rejected" },
]

const getStatusColor = (status) => {
  switch (status) {
    case "Completed":
      return "#4CAF50"
    case "Learning Initiated":
      return "#FFC107"
    case "Learning Suspended":
      return "#F44336"
    case "Completed with Delay":
      return "#9C27B0"
    case "Incomplete":
      return "#FF5722"
    case "Rejected":
      return "#E91E63"
    case "Overdue":
      return "#FF9800"
    default:
      return "#757575"
  }
}

const rowsPerPage = 5



const DownloadReport = () => {
  const [tabValue, setTabValue] = useState(0)
  const [fromDate, setFromDate] = useState(null)
    const [toDate, setToDate] = useState(null)
    const [reportData, setReportData] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const [selectedStatus, setSelectedStatus] = useState("all")
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
  
        const response = await fetch(
          `http://localhost:8000/api/report/data?fromDate=${from}&toDate=${to}&status=${selectedStatus}`,
        )
  
        if (!response.ok) {
          const errorText = await response.text()
          throw new Error(errorText || "Failed to fetch report data")
        }
  
        const data = await response.json()
  
        if (!data.success) {
          throw new Error(data.error || "Invalid response from server")
        }
  
        if (data.data.length === 0) {
          setNoDataMessage("No data found for the selected filters")
          setReportData([])
        } else {
          setReportData(data.data || [])
          setPage(1)
        }
      } catch (err) {
        console.error("Error:", err)
  
        // Check if the error is "No data found for the selected filters"
        if (err.message && err.message.includes("No data found for the selected filters")) {
          setNoDataMessage("No data found for the selected filters")
          setError(null)
        } else {
          setError(err.message || "Failed to load report")
        }
  
        setReportData([])
      } finally {
        setLoading(false)
      }
    }
  
    const handleExport = () => {
      const from = fromDate?.toISOString().split("T")[0] || ""
      const to = toDate?.toISOString().split("T")[0] || ""
      window.location.href = `http://localhost:8000/api/export-excel?fromDate=${from}&toDate=${to}&status=${selectedStatus}`
    }
  
    const handleStatusFilter = (event, newStatus) => {
      if (newStatus !== null) {
        setSelectedStatus(newStatus)
      }
    }
  
    const handleClearFilters = () => {
      setFromDate(null)
      setToDate(null)
      setSelectedStatus("all")
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


  const handleTabChange = (event, newValue) => {
    setTabValue(newValue)
  }

 

  const getIndicatorStyle = (tabValue) => {
    switch (tabValue) {
      case 0:
        return { marginLeft: "80px"};
      case 1:
        return { marginLeft: "70px" };
      case 2:
        return { marginLeft: "70px"};
      default:
        return { marginLeft: "30px" };
    }
  };


  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        opacity: 1,
        padding: 3,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        transition: "min-height 0.3s ease",
        fontFamily: '"Poppins", sans-serif',
      }}
    >
      <Paper elevation={0} sx={{ mb: 4, borderRadius: "10px", overflow: "hidden" }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          sx={{
            borderBottom: "1px solid #e0e0e0",
            "& .MuiTabs-indicator": {
              backgroundColor: "#FA5864",
              height: "3px",
              width: "40px !important",
              ...getIndicatorStyle(tabValue),
              
            },
            
            "& .Mui-selected": {
              color: "#09459E !important",
              fontWeight: "500",
            },
          }}
        >
          <Tab
            label="Learning Program Report"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
          <Tab
            label="shruti rename this"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
          <Tab
            label="Effectiveness Reports"
            sx={{
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: "400",
              minWidth: "120px",
            }}
          />
        </Tabs> 

        <Box sx={{ p: 3 }}>
          {tabValue === 0 && (
            <Box>
      
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
                  {/* Improved date picker styling */}
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

                            "& .MuiDateCalendar-root": {
          width: "204px", // Set the width to 204px
          height: "280px",
        },
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
                            "& .MuiPickersCalendarHeader-switchViewButton": {
                              width: "20px",
                              height: "24px",
                            },
                            "& .MuiPickersArrowSwitcher-button": {
                              width: "24px",
                              height: "24px",
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

                            "& .MuiDateCalendar-root": {
          width: "204px", // Set the width to 204px
          height: "280px",
        },

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
                            "& .MuiPickersCalendarHeader-switchViewButton": {
                              width: "24px",
                              height: "24px",
                            },
                            "& .MuiPickersArrowSwitcher-button": {
                              width: "24px",
                              height: "24px",
                            },
                          },
                        },
                      }}
                    />
                  </Box>
                </Box>
      
                <ToggleButtonGroup
                  value={selectedStatus}
                  exclusive
                  onChange={handleStatusFilter}
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
                  {statusFilters.map((filter) => (
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
                    // border: "1px solid",
                    width:"98.5%",
                    borderColor: "divider",
                    mb: 2,
                    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
                    "& .MuiTableCell-root": {
                      fontSize: "12px !important",
                    
                    },
                  
                  }}
                >
                  <Table stickyHeader size="small" sx={{ padding:"0px"}} >
                    <TableHead>
                      <TableRow sx={{ borderBottom: "5px solid #8FBEF8" }}>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Request ID</TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Project Name
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          New Prospect (Y/N)
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Prospect Name
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Course Name</TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Employee Name
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Employee Mail Id
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Employee Designation
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Course Status
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Comments</TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>User Status</TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Skill Type</TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Assigned Date
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Expected Learning Completion Date
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Actual Learning Completion Date
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Progress</TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Request Created By
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Request Assigned To
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Course Assigned By
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Training Duration
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Faculty/Mentor Name
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Faculty/Mentor Mail Id
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Faculty/Mentor Designation
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>Course Type</TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Effectiveness Initiated (Y/N)
                        </TableCell>
                        <TableCell sx={{ minWidth: 100, fontWeight: "600", backgroundColor: "white" }}>
                          Service Division (Tech/Content)
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {paginatedData.length > 0 ? (
                        paginatedData.map((row, index) => (
                          <TableRow
                            key={`row-${row["Request ID"]}-${index}`}
                            // hover
                            sx={{ backgroundColor: index % 2 === 0 ? "#F1F2FD" : "white" }}
                          >
                            <TableCell>{row["Request ID"]}</TableCell>
                            <TableCell>{row["Project Name"]}</TableCell>
                            <TableCell>{row["New Prospect (Y/N)"]}</TableCell>
                            <TableCell>{row["Prospect Name"]}</TableCell>
                            <TableCell>{row["Course Name"]}</TableCell>
                            <TableCell>{row["Employee Name"]}</TableCell>
                            <TableCell>{row["Employee Mail Id"]}</TableCell>
                            <TableCell>{row["Employee Designation"]}</TableCell>
                            <TableCell>
                              <Box sx={{ color: getStatusColor(row["Course Status"]), fontWeight: "500" }}>
                                {row["Course Status"]}
                              </Box>
                            </TableCell>
                            <TableCell>{row["Comments"] || "-"}</TableCell>
                            <TableCell>{row["User Status"]}</TableCell>
                            <TableCell>{row["Skill Type"]}</TableCell>
                            <TableCell>{row["Assigned Date"]}</TableCell>
                            <TableCell>{row["Expected Learning Completion Date"]}</TableCell>
                            <TableCell>{row["Actual Learning Completion Date"]}</TableCell>
                            <TableCell>
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Box sx={{ width: "100%", bgcolor: "divider", borderRadius: 2, overflow: "hidden" }}>
                                  <Box
                                    sx={{
                                      width: `${row["Progress"]}%`,
                                      height: 6,
                                      bgcolor:
                                        row["Progress"] >= 80
                                          ? "success.main"
                                          : row["Progress"] >= 50
                                            ? "warning.main"
                                            : "error.main",
                                    }}
                                  />
                                </Box>
                                <span>{row["Progress"]}%</span>
                              </Box>
                            </TableCell>
                            <TableCell>{row["Request Created By"]}</TableCell>
                            <TableCell>{row["Request Assigned To"]}</TableCell>
                            <TableCell>{row["Course Assigned By"] || "-"}</TableCell>
                            <TableCell>{row["Training Duration"]}</TableCell>
                            <TableCell>{row["Faculty/Mentor Name"]}</TableCell>
                            <TableCell>{row["Faculty/Mentor Mail Id"]}</TableCell>
                            <TableCell>{row["Faculty/Mentor Designation"]}</TableCell>
                            <TableCell>{row["Course Type"]}</TableCell>
                            <TableCell>{row["Effectiveness Initiated (Y/N)"]}</TableCell>
                            <TableCell>{row["Service Division (Tech/Content)"]}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={26} align="center" sx={{ py: 3 }}>
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
          </Box>
          )}

          {tabValue === 1 && (
            <>
              <FeedbackDashboard />
            </>
          )}

          {tabValue === 2 && (
            <>
              <ManagerFeedbackDashboard />
            </>
          )}
        </Box>
      </Paper>
    </Box>
  );
};

export default DownloadReport

