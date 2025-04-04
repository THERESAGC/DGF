
import { useState, useEffect, useContext } from "react"
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  Avatar,
  IconButton,
  Pagination,
  CircularProgress,
  LinearProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  TextareaAutosize,
  Radio,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import { KeyboardArrowDown, KeyboardArrowUp, ChatBubbleOutline, Close as CloseIcon } from "@mui/icons-material"
import { useParams } from "react-router-dom"
import { arrayBufferToBase64 } from "../../utils/ImgConveter"
import AssignCourseModal from "./AssignCourseModal"
// import CommentsSidebar from "./CommentsSidebar"
import PropTypes from "prop-types"
import ArrowCircleRightOutlinedIcon from "@mui/icons-material/ArrowCircleRightOutlined"
import CommentsSidebar from "./commentsSidebar"
import AuthContext from "../Auth/AuthContext"

const StyledTableContainer = styled(TableContainer)(({ theme }) => ({
  "& .MuiTableCell-root": {
    padding: "16px",
    textAlign: "center",
    fontFamily: "inherit",
  },
  "& .MuiTableCell-root:first-of-type": {
    paddingRight: "0px !important",
    fontFamily: "inherit",
  },
  "& .MuiTableCell-root:nth-of-type(2)": {
    paddingLeft: "0px !important",
    fontFamily: "inherit",
  },
  "& .innertable": {
    padding: "0px !important",
  },
  "& .innertable th": {
    fontSize: "10px !important",
    fontWeight: "bold",
  },
  "& .innertable td": {
    fontSize: "10px !important",
  },
}))

const HeaderButton = styled(Button)(({ theme }) => ({
  height: "30px",
  fontSize: "10px",
  textTransform: "none",
  fontFamily: "inherit",
  padding: "8px 10px",
  backgroundColor: "#fff",
  color: "#666",
  border: "1px solid #ddd",
  borderRadius: "6px",
  "&:hover": {
    backgroundColor: "#f5f5f5",
  },
}))

const ActionIconButton = styled(IconButton)(({ theme, disabled }) => ({
  width: "22px",
  height: "22px",
  border: disabled ? "2px solid #a9a9a9" : "2px solid #000000",
  borderRadius: "50%",
  marginRight: "10px",
  marginLeft: "8px",
  backgroundColor: disabled ? "#d3d3d3" : "rgba(255, 255, 255, 0)",
  "&:hover": {
    backgroundColor: disabled ? "#d3d3d3" : "#d1d1d1",
  },
  "& svg": {
    fontSize: "16px",
    fontWeight: "bold",
    // color: disabled ? "#a9a9a9" : "inherit",
  },
}))

const StatusChip = styled(Box)(({ theme }) => ({
  padding: "6px 12px",
  color: "#06819E",
}))

function Row({ row, isExpanded, isSelected, onToggleExpand, onSelect, onAssignCourse, onStatusUpdate }) {
  const [assignedCourses, setAssignedCourses] = useState([])
  const [loadingCourses, setLoadingCourses] = useState(false)
  const [anchorElMap, setAnchorElMap] = useState({})
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" })
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [currentAssignmentId, setCurrentAssignmentId] = useState(null)
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [selectedStatus, setSelectedStatus] = useState("")
  const [commentText, setCommentText] = useState("")

  const handleMenuClick = (event, assignmentId) => {
    setCurrentAssignmentId(assignmentId)
    setSelectedStatus("")
    setCommentText("")
    setStatusDialogOpen(true)
  }

  const handleMenuClose = (assignmentId) => {
    setAnchorElMap((prev) => ({ ...prev, [assignmentId]: null }))
  }

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/course-status/${assignmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (!response.ok) throw new Error("Failed to update status")

      setAssignedCourses((prev) =>
        prev.map((course) => (course.assignment_id === assignmentId ? { ...course, status: newStatus } : course)),
      )

      setSnackbar({ open: true, message: "Status updated successfully!", severity: "success" })
      onStatusUpdate()
    } catch (error) {
      console.error("Update error:", error)
      setSnackbar({ open: true, message: error.message || "Failed to update status", severity: "error" })
    }
  }

  const handleCommentSubmit = async () => {
    try {
      // If a status is selected, update the status
      if (selectedStatus) {
        await handleStatusUpdate(currentAssignmentId, selectedStatus)
      }

      // If there's a comment, submit it
      if (commentText.trim()) {
        const response = await fetch(`http://localhost:8000/api/status-comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            assignmentId: currentAssignmentId,
            comments: commentText,
          }),
        })

        if (!response.ok) throw new Error("Failed to add comment")

        setSnackbar({ open: true, message: "Comment added successfully!", severity: "success" })
      }

      setStatusDialogOpen(false)
      setCommentText("")
      setSelectedStatus("")
    } catch (error) {
      console.error("Comment submission error:", error)
      setSnackbar({ open: true, message: error.message || "Failed to submit comment", severity: "error" })
    }
  }

  const handleChatIconClick = (assignmentId) => {
    console.log(assignmentId, "clicked")
    setCurrentAssignmentId(assignmentId)
    setSidebarOpen(true)
  }

  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        setLoadingCourses(true)
        const response = await fetch(`http://localhost:8000/api/assigned-courses/${row.emp_id}/${row.requestid}`)
        const data = await response.json()
        setAssignedCourses(data.data || [])
      } catch (error) {
        console.error("Fetch error:", error)
        setSnackbar({ open: true, message: "Failed to load courses", severity: "error" })
      } finally {
        setLoadingCourses(false)
      }
    }

    if (isExpanded) fetchAssignedCourses()
  }, [isExpanded, row.emp_id, row.requestid])
  useEffect(() => {
    // This useEffect will run whenever assignedCourses changes
    console.log("Assigned courses updated:", assignedCourses)
  }, [assignedCourses])
  return (
    <>
      <TableRow sx={{ backgroundColor: isExpanded ? "#f1f2fd" : "white" }}>
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={() => onToggleExpand(row.emp_id)}>
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox checked={isSelected} onChange={onSelect} color="primary" disabled={row.coursesAssigned == 3} />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "-webkit-box", alignItems: "center", gap: 1 }}>
            <Avatar src={row.avatar} alt={row.name} />
            {row.name}
          </Box>
        </TableCell>
        <TableCell>{row.coursesAssigned}</TableCell>
        <TableCell>{row.availableFrom}</TableCell>
        <TableCell>{row.dailyBandwidth}</TableCell>
        <TableCell>{row.weekendAvailability}</TableCell>
        <TableCell>
          <StatusChip>{row.status}</StatusChip>
        </TableCell>

        <TableCell style={{ textAlign: "left" }}>
          <HeaderButton
            onClick={() => onAssignCourse(row.emp_id, row.coursesAssigned)}
            disabled={row.coursesAssigned >= 3}
          >
            Assign Course
          </HeaderButton>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow sx={{ backgroundColor: "#f1f2fd" }}>
          <TableCell colSpan={12} className="innertable">
            <Box sx={{ textAlign: "left" }}>
              {loadingCourses ? (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table>
                  <TableHead sx={{ backgroundColor: "#FAFAFA" }}>
                    <TableRow>
                      <TableCell width="48px" style={{ paddingLeft: "0px !important" }} />
                      <TableCell padding="checkbox" width="48px" />
                      <TableCell style={{ textAlign: "left", width: "100px" }}>Mentor</TableCell>
                      <TableCell style={{ textAlign: "left" }}>Course Name</TableCell>
                      <TableCell align="center">End Date</TableCell>
                      <TableCell align="center">Comments</TableCell>

                      <TableCell align="center">Status</TableCell>
                      <TableCell style={{ textAlign: "left", width: " 9%" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedCourses.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell />
                        <TableCell />
                        <TableCell sx={{ textAlign: "left !important" }}>{course.mentor_name}</TableCell>
                        <TableCell sx={{ paddingLeft: "16px" }}>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                            <Typography
                              variant="body2"
                              sx={{
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                fontSize: "10px !important",
                                mb: 1,
                                textAlign: "left",
                                width: "200px",
                              }}
                            >
                              {course.course_name || "N/A"}
                            </Typography>
                            <Box
                              sx={{
                                width: "100%",
                                maxWidth: "100px",
                                alignItems: "center",
                                gap: "5px",
                                display: "flex",
                              }}
                            >
                              <LinearProgress
                                variant="determinate"
                                value={course.progress || 0}
                                sx={{ height: 8, borderRadius: 4, width: "48px" }}
                              />

                              <Typography variant="caption">{course.progress || 0}%</Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {course.completion_date ? new Date(course.completion_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{course.comments || "N/A"}</TableCell>
                        <TableCell>
                          <StatusChip>{course.status || "N/A"}</StatusChip>
                        </TableCell>
                        <TableCell>
                          <IconButton
                            style={{ height: "20px", width: "20px" }}
                            size="small"
                            onClick={(e) => handleMenuClick(e, course.assignment_id)}
                            disabled={["Completed", "Incomplete", "Completed with Delay"].includes(course.status)}
                          >
                            <ArrowCircleRightOutlinedIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleChatIconClick(course.assignment_id)}>
                            <ChatBubbleOutline />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </Box>
          </TableCell>
        </TableRow>
      )}

      {/* Status Update Dialog */}
      <Dialog open={statusDialogOpen} onClose={() => setStatusDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e0e0e0",
            pb: 1,
          }}
        >
          Update Status
          <IconButton aria-label="close" onClick={() => setStatusDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: 2, mt: 1 }}>
          <FormControl component="fieldset" sx={{ mb: 2, width: "100%" }}>
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: "medium" }}>
              Select Status (Optional)
            </FormLabel>
            <RadioGroup value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)} row>
              {["Completed", "Incomplete", "Learning Suspended", "Completed with Delay"].map((status) => (
                <FormControlLabel key={status} value={status} control={<Radio />} label={status} sx={{ mr: 2 }} />
              ))}
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth sx={{ mt: 2 }}>
            <FormLabel component="legend" sx={{ mb: 1, fontWeight: "medium" }}>
              Add Comment
            </FormLabel>


 <TextareaAutosize
            minRows={3}
            style={{
              width: '99%',
             
              border: '1px solid #ddd',
              borderRadius: '4px',
              resize: 'none',  // Disable resizing
              overflowY: 'scroll',  // Enable scrolling if content overflows
              outline: 'none',  // Remove outline
            }}
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />


          </FormControl>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setStatusDialogOpen(false)} variant="outlined" size="small">
            Cancel
          </Button>
          <Button
            onClick={handleCommentSubmit}
            variant="contained"
            color="primary"
            size="small"
            disabled={!selectedStatus && !commentText.trim()}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sidebar component */}
      <CommentsSidebar open={isSidebarOpen} onClose={() => setSidebarOpen(false)} assignmentId={currentAssignmentId} />
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  )
}

Row.propTypes = {
  row: PropTypes.shape({
    emp_id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    coursesAssigned: PropTypes.number,
    availableFrom: PropTypes.string,
    dailyBandwidth: PropTypes.string,
    weekendAvailability: PropTypes.string,
    status: PropTypes.string,
    requestid: PropTypes.string.isRequired,
    assignment_id: PropTypes.string,
  }).isRequired,
  isExpanded: PropTypes.bool.isRequired,
  isSelected: PropTypes.bool.isRequired,
  onToggleExpand: PropTypes.func.isRequired,
  onSelect: PropTypes.func.isRequired,
  onAssignCourse: PropTypes.func.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
}

export default function CourseTracker() {
  const { requestId } = useParams()
  const [page, setPage] = useState(1)
  const [learners, setLearners] = useState([])
  const [loading, setLoading] = useState(false)
  const [expandedId, setExpandedId] = useState(null)
  const [selectedEmployees, setSelectedEmployees] = useState([])
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [coursesAssigned, setCoursesAssigned] = useState(0)
  const itemsPerPage = 5

  const fetchLearnersData = async () => {
    try {
      setLoading(true)
      const response = await fetch(
        `http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/?requestid=${requestId}`,
      )
      const data = await response.json()
      console.log(data)
      const formattedLearners = data.employees.map((item) => ({
        emp_id: item.emp_id,
        name: item.emp_name || item.emp_id,
        avatar: item.profile_image?.data
          ? `data:image/jpeg;base64,${arrayBufferToBase64(item.profile_image.data)}`
          : "/placeholder.svg",
        coursesAssigned: item.courses_assigned,
        availableFrom: new Date(item.availablefrom).toLocaleDateString(),
        dailyBandwidth: item.dailyband,
        weekendAvailability: item.availableonweekend === 1 ? "Yes" : "No",
        status: item.status === "0" ? "Not Assigned" : item.status,
        requestid: requestId,
      }))

      setLearners(formattedLearners)
    } catch (error) {
      console.error("Error fetching learners:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchLearnersData()
  }, [requestId])

  const totalPages = Math.ceil(learners.length / itemsPerPage)
  const currentItems = learners.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const handleSelectEmployee = (empId) => {
    setSelectedEmployees((prev) => (prev.includes(empId) ? prev.filter((id) => id !== empId) : [...prev, empId]))
  }
  const handleAssignCourse = (empIds, coursesAssigned) => {
    console.log(empIds, coursesAssigned, "Initiate Learning Details Page");
 
    if (Array.isArray(empIds)) {
      // Multiple employees selected
      setSelectedEmployees(empIds);
 
      // Calculate the maximum courses assigned among the selected employees
      const maxCoursesAssigned = Math.max(...empIds.map((empId) => {
        const employee = learners.find((learner) => learner.emp_id === empId);
        return employee ? employee.coursesAssigned : 0;
      }));
 
      setCoursesAssigned(maxCoursesAssigned);
    } else {
      // Single employee selected
      setSelectedEmployees([empIds]);
      setCoursesAssigned(coursesAssigned); // Use the provided coursesAssigned value
    }
 
    setShowAssignModal(true);
  };

  const user = useContext(AuthContext)?.user // Retrieve user from AuthContext

  const handleSendEmails = async (empIds) => {
    console.log("Send Reminder Clicked")

    const learningInitiatedAssignments = []

    // Fetch assigned courses for all selected employees
    for (const empId of empIds) {
      try {
        const response = await fetch(`http://localhost:8000/api/assigned-courses/${empId}/${requestId}`)
        const data = await response.json()

        // Filter assignment IDs with status "Learning Initiated"
        const initiatedAssignments = (data.data || [])
          .filter((course) => course.status === "Learning Initiated")
          .map((course) => course.assignment_id)

        learningInitiatedAssignments.push(...initiatedAssignments)
      } catch (error) {
        console.error(`Error fetching assigned courses for employee ${empId}:`, error)
      }
    }

    console.log("Learning Initiated Assignment IDs for Selected Employees:", learningInitiatedAssignments)

    if (learningInitiatedAssignments.length > 0) {
      try {
        const requestBody = {
          learningInitiatedAssignments,
          empId: user.emp_id,
        }

        console.log("Request Body:", requestBody)

        const response = await fetch("http://localhost:8000/api/send-reminder", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        })

        console.log("Response:", response)

        if (!response.ok) {
          const errorText = await response.text()
          console.error("Error Response Text:", errorText)
          throw new Error(`Failed to send reminders: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        console.log(data.message)
        alert("Reminder emails have been sent successfully!")
      } catch (error) {
        console.error("Error sending reminders:", error)
        alert("There was an error sending the reminders.")
      }
    }
  }

  const handleModalClose = () => {
    setShowAssignModal(false)
    setSelectedEmployees([])
    fetchLearnersData() // Uncomment this line to reload the data
  }
  return (
    <Box
      sx={{
        backgroundColor: "#FFFFFF",
        borderRadius: "15px",
        p: 3,
        boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
        position: "relative",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5" style={{ fontWeight: "600" }}>
          Assign Courses & Track Progress
        </Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <HeaderButton
            variant="outlined"
            onClick={() => handleSendEmails(selectedEmployees)}
            disabled={selectedEmployees.length === 0}
          >
            Send Reminder ({selectedEmployees.length})
          </HeaderButton>
          <HeaderButton
            variant="outlined"
            onClick={() => handleAssignCourse(selectedEmployees, 0)}
            disabled={selectedEmployees.length === 0}
          >
            Assign Course ({selectedEmployees.length})
          </HeaderButton>
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <StyledTableContainer component={Paper} sx={{ width: "100%", boxShadow: "none", padding: "0px" }}>
            <Table aria-label="course-tracker-table">
              <TableHead sx={{ backgroundColor: "#FAFAFA" }}>
                <TableRow>
                  <TableCell style={{ paddingLeft: "0px !important", width: "30px !important" }} />
                  <TableCell padding="checkbox" style={{ width: "30px !important" }}>
                    <Checkbox
                      checked={
                        selectedEmployees.length > 0 &&
                        selectedEmployees.length === currentItems.filter((row) => row.coursesAssigned < 3).length
                      }
                      indeterminate={
                        selectedEmployees.length > 0 &&
                        selectedEmployees.length < currentItems.filter((row) => row.coursesAssigned < 3).length
                      }
                      onChange={(e) => {
                        if (e.target.checked) {
                          // Select all employees that have less than 3 courses assigned
                          setSelectedEmployees(
                            currentItems.filter((row) => row.coursesAssigned < 3).map((row) => row.emp_id),
                          )
                        } else {
                          // Deselect all employees
                          setSelectedEmployees([])
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell style={{ textAlign: "left", width: "120px" }}>Name</TableCell>
                  <TableCell style={{ textAlign: "center", width: "120px" }}>Courses Assigned</TableCell>
                  <TableCell align="center">Available From</TableCell>
                  <TableCell align="center">Bandwidth</TableCell>
                  <TableCell align="center">Weekends</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell style={{ textAlign: "left", width: "110px" }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((row) => (
                  <Row
                    key={row.emp_id}
                    row={row}
                    isExpanded={expandedId === row.emp_id}
                    isSelected={selectedEmployees.includes(row.emp_id)}
                    onToggleExpand={(id) => setExpandedId((prev) => (prev === id ? null : id))}
                    onSelect={() => handleSelectEmployee(row.emp_id)}
                    onAssignCourse={handleAssignCourse}
                    onStatusUpdate={fetchLearnersData}
                  />
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              alignItems: "center",
            }}
          >
            <Typography variant="body2" color="text.secondary">
              Showing {currentItems.length} of {learners.length} records
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              color="primary"
              sx={{
                "& .MuiPaginationItem-root.Mui-selected": {
                  color: "red",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                },
                "& .MuiPaginationItem-root": {
                  margin: "-1px",
                },
              }}
            />
          </Box>
        </>
      )}

      <AssignCourseModal
        open={showAssignModal}
        onClose={handleModalClose}
        employeeIds={selectedEmployees}
        requestId={requestId}
        coursesAssigned={coursesAssigned}
      />
    </Box>
  )
}

