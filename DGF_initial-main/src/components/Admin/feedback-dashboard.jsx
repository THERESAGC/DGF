import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Divider,
  CircularProgress,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  Tabs,
  Tab,
  MenuItem,
  FormControl,
  Select,
  ButtonGroup,
  Tooltip,
  Snackbar,
  Alert,
  Pagination,
} from "@mui/material"
import PropTypes from "prop-types"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers"
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from "recharts"
import {
  Assessment,
  Close,
  Person,
  School,
  Star,
  Comment,
  Lightbulb,
  CalendarMonth,
  PictureAsPdf,
  TableView,
  InsertDriveFile,
  HourglassEmpty,
  CheckCircle,
  PendingActions,
} from "@mui/icons-material"
import axios from "axios"
import { exportData } from "../../utils/learners-export-utils"

// Utility function to map numeric ratings to text
const mapRatingToText = (field, value) => {
  const mappings = {
    instruction_rating: {
      4: "Very Good",
      3: "Good",
      2: "Interesting",
      1: "Average",
    },
    engaged_rating: {
      4: "Totally Engaged",
      3: "Very Engaged",
      2: "Engaged",
      1: "Somewhat Engaged",
    },
    interactive: {
      2: "Yes",
      1: "No",
    },
    interactive_components: {
      4: "Very Interactive",
      3: "Interactive",
      2: "Somewhat Interactive",
      1: "Less Interactive",
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

// Rating chip component with appropriate colors
const RatingChip = ({ rating, field }) => {
  const theme = useTheme()
  const colors = {
    4: "#8fd3b6", // Pastel green
    3: "#a6dcef", // Pastel blue
    2: "#ffcb91", // Pastel orange
    1: "#ffb6b9", // Pastel red
  }

  const text = mapRatingToText(field, rating)
  const color = colors[rating] || theme.palette.primary.main

  return (
    <Chip
      label={text}
      sx={{
        backgroundColor: color,
        color: "#333",
        fontWeight: "bold",
        fontSize: "8px !important", // Decreased font size
        height: "20px !important", // Adjusted height to match smaller font
        padding: "0 8px !important",
        "& .MuiChip-label": {
      fontSize: "12px !important", // Set your desired font size here
    },
      }}
    />
  )
}

// Detailed feedback dialog component
const FeedbackDetailDialog = ({ open, handleClose, feedback }) => {
  if (!feedback) return null

  return (
    
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Typography variant="h6">Detailed Feedback</Typography>
        <IconButton onClick={handleClose}>
          <Close />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <Person sx={{ verticalAlign: "middle", mr: 1 }} />
                  Participant Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Name
                  </Typography>
                  <Typography variant="body1">{feedback.emp_name}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Employee ID
                  </Typography>
                  <Typography variant="body1">{feedback.employee_id}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Email
                  </Typography>
                  <Typography variant="body1">{feedback.emp_email}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={6}>
            <Card variant="outlined" sx={{ height: "100%" }}>
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <School sx={{ verticalAlign: "middle", mr: 1 }} />
                  Course Information
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Course ID
                  </Typography>
                  <Typography variant="body1">{feedback.course_id}</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" color="text.secondary">
                    Training Topic
                  </Typography>
                  <Typography variant="body1">{feedback.training_topic}</Typography>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Request ID
                  </Typography>
                  <Typography variant="body1">{feedback.reqid}</Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <Star sx={{ verticalAlign: "middle", mr: 1 }} />
                  Ratings
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Instruction Rating
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <RatingChip rating={feedback.instruction_rating} field="instruction_rating" />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Engagement Rating
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <RatingChip rating={feedback.engaged_rating} field="engaged_rating" />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Program Engaging
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={mapRatingToText("interactive", feedback.interactive)}
                          sx={{
                            backgroundColor: feedback.interactive === "2" ? "#8fd3b6" : "#ffb6b9",
                            color: "#333",
                            fontWeight: "medium",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Interaction Level
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <Chip
                          label={mapRatingToText("interactive_components", feedback.interactive_components)}
                          sx={{
                            backgroundColor:
                              feedback.interactive_components === "4"
                                ? "#8fd3b6"
                                : feedback.interactive_components === "3"
                                  ? "#a6dcef"
                                  : feedback.interactive_components === "2"
                                    ? "#ffcb91"
                                    : "#ffb6b9",
                            color: "#333",
                            fontWeight: "medium",
                          }}
                        />
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Overall Experience
                      </Typography>
                      <Box sx={{ mt: 1 }}>
                        <RatingChip rating={feedback.engaged_session_rating} field="engaged_session_rating" />
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <Comment sx={{ verticalAlign: "middle", mr: 1 }} />
                  Comments
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ mb: 3 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Areas for Improvement
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                    <Typography variant="body1">{feedback.improved_comments || "No comments provided"}</Typography>
                  </Paper>
                </Box>
                <Box>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Other Suggestions
                  </Typography>
                  <Paper variant="outlined" sx={{ p: 2, bgcolor: "background.default" }}>
                    <Typography variant="body1">{feedback.other_suggestions || "No suggestions provided"}</Typography>
                  </Paper>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} variant="contained" sx={{ bgcolor: "#09459e" }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

const FeedbackDashboard = () => {
  const [feedbackData, setFeedbackData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const theme = useTheme()

  // Date filter states
  const [filterType, setFilterType] = useState("range")
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [selectedMonth, setSelectedMonth] = useState("")
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  // Pagination for feedback table
  const [page, setPage] = useState(1)
  const rowsPerPage = 5

  // Add a state for alerts
  const [alert, setAlert] = useState({ open: false, message: "", severity: "success" })

  // Mock data for total feedbacks triggered and pending
  // In a real application, you would fetch this from your API
  const [feedbackStats, setFeedbackStats] = useState({
    totalTriggered: 0,
    totalReceived: 0,
    totalPending: 0,
  })

  useEffect(() => {
    const fetchFeedbackData = async () => {
      try {
        setLoading(true);
  
        // Fetch learner feedback data for total received
        const learnerFeedbackResponse = await axios.get("http://localhost:8000/api/learner-feedback");
        const learnerFeedbackData = learnerFeedbackResponse.data;
  
        // Fetch total triggered feedbacks
        const triggeredFeedbackResponse = await axios.get("http://localhost:8000/api/total-feedbacks-triggered");
        const triggeredFeedbackData = triggeredFeedbackResponse.data;
  
        // Filter data based on the selected date range
        let filteredTriggeredData = triggeredFeedbackData;
        let filteredReceivedData = learnerFeedbackData;
  
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999); // Set to end of the day
  
          // Filter triggered feedbacks by employee_email_sent_date
          filteredTriggeredData = triggeredFeedbackData.filter((item) => {
            const sentDate = new Date(item.employee_email_sent_date);
            return sentDate >= start && sentDate <= end;
          });
  
          // Filter received feedbacks by feedback_submitted_date
          filteredReceivedData = learnerFeedbackData.filter((item) => {
            const submittedDate = new Date(item.feedback_submitted_date);
            return submittedDate >= start && submittedDate <= end;
          });
        }
  
        // Calculate stats
        const totalTriggered = filteredTriggeredData.reduce((sum, item) => sum + item.total_feedbacks_triggered, 0);
        const totalReceived = filteredReceivedData.length;
        const totalPending = totalTriggered - totalReceived;
  
        // Update state
        setFeedbackData(filteredReceivedData); // Set filtered received data
        setFilteredData(filteredReceivedData); // Initially set filtered data to all data
        setFeedbackStats({
          totalTriggered,
          totalReceived,
          totalPending,
        });
  
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch feedback data");
        setLoading(false);
        console.error("Error fetching feedback data:", err);
      }
    };
  
    fetchFeedbackData();
  }, [startDate, endDate]); // Re-run when date range changes

  // Apply date filters
  useEffect(() => {
    if (feedbackData.length === 0) return

    let filtered = [...feedbackData]

    if (filterType === "range" && startDate && endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)
      end.setHours(23, 59, 59, 999) // Set to end of day

      filtered = feedbackData.filter((item) => {
        // Assuming there's a date field in the feedback data
        // You might need to adjust this based on your actual data structure
        const itemDate = new Date(item.created_at || item.date || new Date())
        return itemDate >= start && itemDate <= end
      })
    } else if (filterType === "month" && selectedMonth && selectedYear) {
      const month = Number.parseInt(selectedMonth)
      filtered = feedbackData.filter((item) => {
        const itemDate = new Date(item.created_at || item.date || new Date())
        return itemDate.getMonth() === month - 1 && itemDate.getFullYear() === selectedYear
      })
    }

    setFilteredData(filtered)
    setPage(1) // Reset to first page when filters change
  }, [feedbackData, filterType, startDate, endDate, selectedMonth, selectedYear])

  const handleOpenDialog = (feedback) => {
    setSelectedFeedback(feedback)
    setDialogOpen(true)
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue)
  }

  const handleFilterTypeChange = (event) => {
    setFilterType(event.target.value)
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  // Updated download functionality using the export-utils
  const downloadReport = (format) => {
    setLoading(true)

    try {
      // Use the exportData function from export-utils
      exportData(filteredData, format, "feedback_report")

      setAlert({
        open: true,
        message: `${format.toUpperCase()} report downloaded successfully`,
        severity: "success",
      })
    } catch (error) {
      console.error(`Error downloading ${format} report:`, error)
      setAlert({
        open: true,
        message: `Failed to download ${format} report`,
        severity: "error",
      })
    } finally {
      setLoading(false)
    }
  }

  // Prepare data for charts
  const prepareChartData = () => {
    if (!filteredData.length)
      return { instructionRatings: [], engagementRatings: [], overallRatings: [], interactionData: [] }

    // Count ratings for instruction
    const instructionCounts = filteredData.reduce((acc, item) => {
      const rating = item.instruction_rating
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {})

    // Count ratings for engagement
    const engagementCounts = filteredData.reduce((acc, item) => {
      const rating = item.engaged_rating
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {})

    // Count ratings for overall experience
    const overallCounts = filteredData.reduce((acc, item) => {
      const rating = item.engaged_session_rating
      acc[rating] = (acc[rating] || 0) + 1
      return acc
    }, {})

    // Count for interaction components
    const interactionCounts = filteredData.reduce((acc, item) => {
      const rating = item.interactive_components
      const label = mapRatingToText("interactive_components", rating)
      acc[label] = (acc[label] || 0) + 1
      return acc
    }, {})

    // Declare ionRatings before assigning it
    const ionRatings = Object.keys(instructionCounts).map((key) => ({
      name: mapRatingToText("instruction_rating", key),
      value: instructionCounts[key],
      rating: key,
    }))

    const engagementRatings = Object.keys(engagementCounts).map((key) => ({
      name: mapRatingToText("engaged_rating", key),
      value: engagementCounts[key],
      rating: key,
    }))

    const overallRatings = Object.keys(overallCounts).map((key) => ({
      name: mapRatingToText("engaged_session_rating", key),
      value: overallCounts[key],
      rating: key,
    }))

    const interactionData = Object.keys(interactionCounts).map((key) => ({
      name: key,
      value: interactionCounts[key],
    }))

    return { instructionRatings: ionRatings, engagementRatings, overallRatings, interactionData }
  }

  const { instructionRatings, engagementRatings, overallRatings, interactionData } = prepareChartData()

  // Calculate summary statistics
  const calculateSummary = () => {
    if (!filteredData.length)
      return {
        totalFeedbacks: 0,
        avgInstructionRating: 0,
        avgEngagementRating: 0,
        avgOverallRating: 0,
        avgInteractionRating: 0,
      }

    const totalFeedbacks = filteredData.length

    const sumInstructionRating = filteredData.reduce((sum, item) => sum + Number.parseInt(item.instruction_rating), 0)
    const avgInstructionRating = (sumInstructionRating / totalFeedbacks).toFixed(1)

    const sumEngagementRating = filteredData.reduce((sum, item) => sum + Number.parseInt(item.engaged_rating), 0)
    const avgEngagementRating = (sumEngagementRating / totalFeedbacks).toFixed(1)

    const sumOverallRating = filteredData.reduce((sum, item) => sum + Number.parseInt(item.engaged_session_rating), 0)
    const avgOverallRating = (sumOverallRating / totalFeedbacks).toFixed(1)

    const sumInteractionRating = filteredData.reduce(
      (sum, item) => sum + Number.parseInt(item.interactive_components),
      0,
    )
    const avgInteractionRating = (sumInteractionRating / totalFeedbacks).toFixed(1)

    const engagingYesCount = filteredData.filter((item) => item.interactive === "2").length
    const engagingPercentage = ((engagingYesCount / totalFeedbacks) * 100).toFixed(0)

    return {
      totalFeedbacks,
      avgInstructionRating,
      avgEngagementRating,
      avgOverallRating,
      avgInteractionRating,
      engagingPercentage,
    }
  }

  const summary = calculateSummary()

  // Updated pastel colors for charts
  const COLORS = {
    instruction: ["#a3c9f1","#7fb3e6","#5a9bd8" ,"#3d82c4" ], // Lighter blues
    engagement: ["#ffa07a", "#ff725e", "#e65c4d", "#cc4a3d"], // Lighter reds/oranges
    overall: [ "#bfa3db","#9b7fc1","#7b5ea5", "#5a3e85"], // Professional muted purples
    interaction: ["#f9d36e", "#a6dcef", "#ffcb91", "#ffb6b9"], // Soft neutrals and light blues
  }

  // Custom tooltip for charts

  
  const CustomTooltip = ({ active, payload }) => {
      if (active && payload && payload.length) {
        return (
          <Paper sx={{ p: 1.5, boxShadow: 3, bgcolor: "white" }}>
            <Typography variant="body2">{`${payload[0].name}: ${payload[0].value}`}</Typography>
          </Paper>
        )
      }
      return null
    }
  
  CustomTooltip.propTypes = {
    active: PropTypes.bool,
    payload: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      })
    ),
  };

  // Generate years for dropdown (last 5 years)
  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)

  // Get current page of data for the table
  const paginatedData = filteredData.slice((page - 1) * rowsPerPage, page * rowsPerPage)

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <CircularProgress />
      </Box>
    )
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Typography color="error" variant="h6">
          {error}
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ bgcolor: "#f5f5f5", px: "0px !important" }}>
      <Container maxWidth="xl" sx={{ px: "0 !important", py: "0 !important" }}>
        <Paper
          elevation={0}
          sx={{
            bgcolor: "white",
            display: "flex",
            flexDirection: "column",
            alignItems: "stretch",
          }}
        >
          {/* Header */}
          <Box sx={{ p: 3, borderBottom: 1, borderColor: "divider", bgcolor: "white" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Assessment sx={{ color: "#09459e", mr: 1 }} />
                <Typography variant="h5" component="h1" sx={{ fontWeight: "bold", color: "#09459e" }}>
                  Learning Feedback Dashboard
                </Typography>
              </Box>
              <ButtonGroup variant="outlined" size="small">
                <Tooltip title="Download Excel">
                  <Button
                    startIcon={<TableView />}
                    onClick={() => downloadReport("xlsx")}
                    sx={{ textTransform: "none" }}
                  >
                    Excel
                  </Button>
                </Tooltip>
                <Tooltip title="Download PDF">
                  <Button
                    startIcon={<PictureAsPdf />}
                    onClick={() => downloadReport("pdf")}
                    sx={{ textTransform: "none" }}
                  >
                    PDF
                  </Button>
                </Tooltip>
                <Tooltip title="Download CSV">
                  <Button
                    startIcon={<InsertDriveFile />}
                    onClick={() => downloadReport("csv")}
                    sx={{ textTransform: "none" }}
                  >
                    CSV
                  </Button>
                </Tooltip>
              </ButtonGroup>
            </Box>
            <Typography variant="body2" color="text.secondary">
              Comprehensive analysis of participant feedback for training sessions
            </Typography>
          </Box>

          {/* Date Filter Section */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <CalendarMonth sx={{ color: "#09459e", mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: "medium", color: "#09459e" }}>
                  Filter by Date
                </Typography>
              </Box>

              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={3}>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    Filter Type
                  </Typography>
                  <FormControl fullWidth size="small">
                    <Select value={filterType} onChange={handleFilterTypeChange}>
                      <MenuItem value="range">Date Range</MenuItem>
                      <MenuItem value="month">Month & Year</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                {filterType === "range" ? (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        From
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={startDate}
                          onChange={setStartDate}
                          slotProps={{ textField: { fullWidth: true, size: "small" } }}
                        />
                      </LocalizationProvider>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        To
                      </Typography>
                      <LocalizationProvider dateAdapter={AdapterDateFns}>
                        <DatePicker
                          value={endDate}
                          onChange={setEndDate}
                          slotProps={{ textField: { fullWidth: true, size: "small" } }}
                        />
                      </LocalizationProvider>
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Month
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
                          <MenuItem value="1">January</MenuItem>
                          <MenuItem value="2">February</MenuItem>
                          <MenuItem value="3">March</MenuItem>
                          <MenuItem value="4">April</MenuItem>
                          <MenuItem value="5">May</MenuItem>
                          <MenuItem value="6">June</MenuItem>
                          <MenuItem value="7">July</MenuItem>
                          <MenuItem value="8">August</MenuItem>
                          <MenuItem value="9">September</MenuItem>
                          <MenuItem value="10">October</MenuItem>
                          <MenuItem value="11">November</MenuItem>
                          <MenuItem value="12">December</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <Typography variant="body2" sx={{ mb: 1 }}>
                        Year
                      </Typography>
                      <FormControl fullWidth size="small">
                        <Select value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
                          {years.map((year) => (
                            <MenuItem key={year} value={year}>
                              {year}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </>
                )}

                <Grid item xs={12} sm={1}>
                  <Box sx={{ mt: 3 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ height: "30px", bgcolor: "#1976d2", fontSize: "0.7rem" }}
                      onClick={() => {
                        // Reset filters
                        if (filterType === "range") {
                          setStartDate(null)
                          setEndDate(null)
                        } else {
                          setSelectedMonth("")
                          setSelectedYear(new Date().getFullYear())
                        }
                        setFilteredData(feedbackData)
                      }}
                    >
                      Reset
                    </Button>
                  </Box>
                </Grid>
              </Grid>
            </Paper>
          </Grid>

          {/* Summary Cards Section */}
          <Box sx={{ p: 3, bgcolor: "white", borderBottom: 1, borderColor: "divider" }}>
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "medium", color: "#09459e" }}>
              Summary Statistics
            </Typography>

            {/* Summary Cards Section - Three cards per row with centered titles */}
            <Grid container spacing={3}>
              {/* Total Feedback Card with 3 fields */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: "#a6dcef", color: "#333", borderRadius: 2, height: 180 }}>
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom >
                      Total Feedback
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 1, mt: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <HourglassEmpty fontSize="small" />
                        <Typography variant="body1">
                          Triggered: <strong>{feedbackStats.totalTriggered}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle fontSize="small" />
                        <Typography variant="body1">
                          Received: <strong>{feedbackStats.totalReceived}</strong>
                        </Typography>
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PendingActions fontSize="small" />
                        <Typography variant="body1">
                          Pending: <strong>{feedbackStats.totalPending}</strong>
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Average Instruction Rating Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: "#b5ead7", color: "#333", borderRadius: 2, height: 180 }}>
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>
                      Avg. Instruction Rating
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: "bold", textAlign: "center", mt: 5 }}>
                      {summary.avgInstructionRating}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            opacity: i < Math.round(Number.parseFloat(summary.avgInstructionRating)) ? 1 : 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Average Engagement Rating Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: "#c7ceea", color: "#333", borderRadius: 2, height: 180 }}>
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>
                      Avg. Engagement Rating
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: "bold", textAlign: "center", mt: 5 }}>
                      {summary.avgEngagementRating}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            opacity: i < Math.round(Number.parseFloat(summary.avgEngagementRating)) ? 1 : 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Average Overall Experience Rating Card - NEW */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: "#ffdac1", color: "#333", borderRadius: 2, height: 180 }}>
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>
                      Avg. Overall Experience
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: "bold", textAlign: "center", mt: 5 }}>
                      {summary.avgOverallRating}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            opacity: i < Math.round(Number.parseFloat(summary.avgOverallRating)) ? 1 : 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Average Interaction Rating Card - NEW */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: "#ffb6b9", color: "#333", borderRadius: 2, height: 180 }}>
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>
                      Avg. Interaction Rating
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: "bold", textAlign: "center", mt: 5 }}>
                      {summary.avgInteractionRating}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
                      {[...Array(4)].map((_, i) => (
                        <Star
                          key={i}
                          sx={{
                            opacity: i < Math.round(Number.parseFloat(summary.avgInteractionRating)) ? 1 : 0.5,
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>

              {/* Program Engaging Card */}
              <Grid item xs={12} sm={6} md={4}>
                <Card sx={{ bgcolor: "#a3c9f1", color: "#333", borderRadius: 2, height: 180 }}>
                  <CardContent>
                    <Typography variant="h6" align="center" gutterBottom>
                      Program Engaging
                    </Typography>
                    <Typography variant="h2" sx={{ fontWeight: "bold", textAlign: "center", mt: 4 }}>
                      {summary.engagingPercentage}%
                    </Typography>
                    <Typography variant="body2" sx={{ textAlign: "center", mt: 1 }}>
                      of participants found the program engaging
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Box>

          {/* Charts and Table Section */}
          <Box sx={{ bgcolor: "white" }}>
            <Tabs
              value={activeTab}
              onChange={handleTabChange}
              variant="fullWidth"
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                "& .MuiTab-root": { fontWeight: "bold" },
              }}
            >
              <Tab label="Charts & Analytics" />
              <Tab label="Feedback Table" />
            </Tabs>

            {/* Charts View */}
            {activeTab === 0 && (
              <Box sx={{ p: 3 }}>
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: 350,
                        mb: 2,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 2 }}>
                        Instruction Rating Distribution
                      </Typography>
                      <Box sx={{ height: 280, display: "flex", justifyContent: "center", flexGrow: 1 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth="105%">
                          <PieChart sx={{ width: "100%", height: "87%" }}>
                          <Pie
  data={instructionRatings}
  cx="50%"
  cy="50%"
  innerRadius={0} // Reduced inner radius
  outerRadius={65}
  fill="#8884d8"
  dataKey="value"
  nameKey="name"
  label={({ name, percent, x, y }) => (
    <text
      x={x}
      y={y}
      textAnchor={x > 200 ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontSize: "12px", // Adjust font size here
        fill: "#333", // Adjust text color
        fontWeight: "500", // Optional: Adjust font weight
        
      }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  )}
  isAnimationActive={false}
>
  {instructionRatings.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS.instruction[index % COLORS.instruction.length]}
    />
  ))}
</Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend 
                             wrapperStyle={{
                              fontSize: "12px", // Adjust font size
                              color: "#333", // Adjust text color
                              fontWeight: "600", // Optional: Adjust font weight
                              textAlign: "center", // Optional: Align legend text
                              marginBottom: "5px" // Optional: Adjust margin bottom
                            }}
                             />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: 350,
                        mb: 2,
                        display: "flex",
                        flexDirection: "column",
                      
                      }}
                    >
                      <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 2 }}>
                        Engagement Distribution
                      </Typography>
                      <Box sx={{ height: 280, display: "flex", justifyContent: "center", flexGrow: 1 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth="130%">
                          <PieChart>
                          <Pie
  data={engagementRatings}
  cx="40%"
  cy="50%"
  innerRadius={0}
  outerRadius={65}
  fill="#8884d8"
  dataKey="value"
  nameKey="name"
  label={({ name, percent, x, y }) => (
    <text
      x={x}
      y={y}
      textAnchor={x > 200 ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontSize: "10px", // Adjust font size here
        fill: "#333", // Adjust text color
        fontWeight: "500", // Optional: Adjust font weight
      }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  )}
  isAnimationActive={false}
>
  {engagementRatings.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS.engagement[index % COLORS.engagement.length]}
    />
  ))}
</Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend 
                             wrapperStyle={{
                              fontSize: "11px", // Adjust font size
                              color: "#333", // Adjust text color
                              fontWeight: "600", // Optional: Adjust font weight
                              textAlign: "center", // Optional: Align legend text
                            }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: 350,
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 2 }}>
                        Overall Experience Rating
                      </Typography>
                      <Box sx={{ height: 280, display: "flex", justifyContent: "center", flexGrow: 1 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth="100%">
                          <PieChart>
                          <Pie
  data={overallRatings}
  cx="50%"
  cy="50%"
  innerRadius={0}
  outerRadius={65}
  fill="#8884d8"
  dataKey="value"
  nameKey="name"
  label={({ name, percent, x, y }) => (
    <text
      x={x}
      y={y}
      textAnchor={x > 200 ? "start" : "end"}
      dominantBaseline="central"
      style={{
        fontSize: "10px", // Adjust font size here
        fill: "#333", // Adjust text color
        fontWeight: "500", // Optional: Adjust font weight
      }}
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  )}
  isAnimationActive={false}
>
  {overallRatings.map((entry, index) => (
    <Cell
      key={`cell-${index}`}
      fill={COLORS.overall[index % COLORS.overall.length]}
    />
  ))}
</Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend 
                             wrapperStyle={{
                              fontSize: "12px", // Adjust font size
                              color: "#333", // Adjust text color
                              fontWeight: "600", // Optional: Adjust font weight
                              textAlign: "center", // Optional: Align legend text
                             }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 2,
                        height: 350,
                        display: "flex",
                        flexDirection: "column",
                      
                      }}
                    >
                      <Typography variant="subtitle1" align="center" gutterBottom sx={{ mb: 2 }}>
                        Interaction Level Distribution
                      </Typography>
                      <Box sx={{ height: 280, display: "flex", justifyContent: "center", flexGrow: 1 }}>
                        <ResponsiveContainer width="100%" height="100%" minWidth="120%">
                          <PieChart>
                          <Pie
    data={interactionData}
    cx="50%"
    cy="50%"
    innerRadius={0}
    outerRadius={65}
    fill="#8884d8"
    dataKey="value"
    nameKey="name"
    label={({ name, percent, x, y }) => (
      <text
        x={x}
        y={y}
        textAnchor={x > 200 ? "start" : "end"}
        dominantBaseline="central"
        style={{
          fontSize: "10px", // Adjust font size here
          fill: "#333", // Adjust text color
          fontWeight: "500", // Optional: Adjust font weight
        }}
      >
        {`${name}: ${(percent * 100).toFixed(0)}%`}
      </text>
    )}
    isAnimationActive={false}
  >
    {interactionData.map((entry, index) => (
      <Cell
        key={`cell-${index}`}
        fill={COLORS.interaction[index % COLORS.interaction.length]}
      />
    ))}
  </Pie>
                            <RechartsTooltip content={<CustomTooltip />} />
                            <Legend 
                             wrapperStyle={{
                              fontSize: "12px", // Adjust font size
                              color: "#333", // Adjust text color
                              fontWeight: "600", // Optional: Adjust font weight
                              textAlign: "center", // Optional: Align legend text
                             }}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                      </Box>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}

            {/* Table View */}
            {activeTab === 1 && (
              <Box sx={{ px: 3, py: 3 }}>
                <Paper elevation={0} sx={{ px: 3, py: 3, borderRadius: 2,padding:"0px",marginBottom:"-66px" }}>
                  <Typography variant="h6" gutterBottom sx={{ display: "flex", alignItems: "center" }}>
                    <Lightbulb sx={{ mr: 1, color: "#09459e" }} />
                    Feedback Records
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Click on &quot;View Details&quot; to see the complete feedback record
                  </Typography>
                  <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 440 }}>
                    <Table stickyHeader>
                      <TableHead>
                        <TableRow>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "#09459e", color: "white" }}>
                            Employee
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "#09459e", color: "white" }}>
                            Training Topic
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "#09459e", color: "white" }}>
                            Instruction
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "#09459e", color: "white" }}>
                            Engagement
                          </TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "#09459e", color: "white" }}>Overall</TableCell>
                          <TableCell sx={{ fontWeight: "bold", bgcolor: "#09459e", color: "white" }}>Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {paginatedData.map((feedback) => (
                          <TableRow key={feedback.id} hover>
                            <TableCell>
                              <Box sx={{ display: "flex", flexDirection: "column" }}>
                                <Typography variant="body2" sx={{ fontWeight: "medium" }}>
                                  {feedback.emp_name}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {feedback.employee_id}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>{feedback.training_topic}</TableCell>
                            <TableCell>
                              <RatingChip rating={feedback.instruction_rating} field="instruction_rating" />
                            </TableCell>
                            <TableCell>
                              <RatingChip rating={feedback.engaged_rating} field="engaged_rating" />
                            </TableCell>
                            <TableCell>
                              <RatingChip rating={feedback.engaged_session_rating} field="engaged_session_rating" />
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={() => handleOpenDialog(feedback)}
                                sx={{ textTransform: "none", bgcolor: "#09459e" }}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  {/* Pagination for feedback table */}
                  <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
                    <Pagination
                      count={Math.ceil(filteredData.length / rowsPerPage)}
                      page={page}
                      onChange={handleChangePage}
                      color="primary"
                      sx={{
                        "& .MuiPaginationItem-root": {
                          color: "#09459e",
                        },
                        "& .Mui-selected": {
                          backgroundColor: "rgba(9, 69, 158, 0.1) !important",
                          color: "red",
                        },
                      }}
                    />
                  </Box>
                </Paper>
              </Box>
            )}
          </Box>
        </Paper>
      </Container>

      {/* Detailed Feedback Dialog */}
      <FeedbackDetailDialog open={dialogOpen} handleClose={handleCloseDialog} feedback={selectedFeedback} />

      {/* Alert Snackbar */}
      <Snackbar
        open={alert.open}
        autoHideDuration={4000}
        onClose={() => setAlert({ ...alert, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={() => setAlert({ ...alert, open: false })} severity={alert.severity} variant="filled">
          {alert.message}
        </Alert>
      </Snackbar>
    </Box>
  )
}

export default FeedbackDashboard

