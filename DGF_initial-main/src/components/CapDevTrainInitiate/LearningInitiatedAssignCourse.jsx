import React, { useState, useEffect } from "react";
import {
  Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, Checkbox, Avatar, IconButton, Pagination, PaginationItem,
  CircularProgress, LinearProgress, Menu, MenuItem, Snackbar, Alert
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { KeyboardArrowDown, KeyboardArrowUp, ChatBubbleOutline, ArrowForward } from "@mui/icons-material";
import { useParams } from "react-router-dom";
import { arrayBufferToBase64 } from "../../utils/ImgConveter";
import AssignCourseModal from "./AssignCourseModal";

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
}));

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
}));

const ActionIconButton = styled(IconButton)(({ theme }) => ({
  width: "22px",
  height: "22px",
  border: "2px solid #000000",
  borderRadius: "50%",
  marginRight: "10px",
  marginLeft: "8px",
  backgroundColor: "rgba(255, 255, 255, 0)",
  "&:hover": {
    backgroundColor: "#d1d1d1",
  },
  "& svg": {
    fontSize: "16px",
    fontWeight: "bold",
  },
}));

const StatusChip = styled(Box)(({ theme }) => ({
  padding: "6px 12px",
  color: "#06819E",
}));

function Row({ row, isExpanded, isSelected, onToggleExpand, onSelect, onAssignCourse }) {
  const [assignedCourses, setAssignedCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [anchorElMap, setAnchorElMap] = useState({});
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleMenuClick = (event, assignmentId) => {
    setAnchorElMap(prev => ({ ...prev, [assignmentId]: event.currentTarget }));
  };

  const handleMenuClose = (assignmentId) => {
    setAnchorElMap(prev => ({ ...prev, [assignmentId]: null }));
  };

  const handleStatusUpdate = async (assignmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/course-status/${assignmentId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) throw new Error("Failed to update status");

      setAssignedCourses(prev => prev.map(course => 
        course.assignment_id === assignmentId ? { ...course, status: newStatus } : course
      ));

      setSnackbar({ open: true, message: "Status updated successfully!", severity: "success" });
    } catch (error) {
      console.error("Update error:", error);
      setSnackbar({ open: true, message: error.message || "Failed to update status", severity: "error" });
    }
  };

  useEffect(() => {
    const fetchAssignedCourses = async () => {
      try {
        setLoadingCourses(true);
        const response = await fetch(
          `http://localhost:8000/api/assigned-courses/${row.emp_id}/${row.requestid}`
        );
        const data = await response.json();
        setAssignedCourses(data.data || []);
      } catch (error) {
        console.error("Fetch error:", error);
        setSnackbar({ open: true, message: "Failed to load courses", severity: "error" });
      } finally {
        setLoadingCourses(false);
      }
    };

    if (isExpanded) fetchAssignedCourses();
  }, [isExpanded, row.emp_id, row.requestid]);

  return (
    <>
      <TableRow sx={{ backgroundColor: isExpanded ? "#f1f2fd" : "white" }}>
        <TableCell padding="checkbox">
          <IconButton size="small" onClick={() => onToggleExpand(row.emp_id)}>
            {isExpanded ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={onSelect}
            color="primary"
          />
        </TableCell>
        <TableCell>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
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
        <TableCell>
          <HeaderButton onClick={() => onAssignCourse(row.emp_id)}>
            Assign Course
          </HeaderButton>
        </TableCell>
      </TableRow>

      {isExpanded && (
        <TableRow sx={{ backgroundColor: "#f1f2fd" }}>
          <TableCell colSpan={9} sx={{ py: 0 }}>
            <Box sx={{ ml: 10, mr: 8, textAlign: "left" }}>
              {loadingCourses ? (
                <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
                  <CircularProgress />
                </Box>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: "bold", paddingRight: "16px" }}>Mentor</TableCell>
                      <TableCell sx={{ fontWeight: "bold", paddingLeft: "16px" }}>Course Name</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>End Date</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Comments</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: "bold" }}>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {assignedCourses.map((course, index) => (
                      <TableRow key={index}>
                        <TableCell sx={{ paddingRight: "16px" }}>{course.mentor_name}</TableCell>
                        <TableCell sx={{ paddingLeft: "16px" }}>
                          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                            <Typography variant="body2" sx={{
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              fontSize: "12px",
                              mb: 1,
                            }}>
                              {course.course_name || "N/A"}
                            </Typography>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Box sx={{ width: "70%", maxWidth: "200px" }}>
                                <LinearProgress
                                  variant="determinate"
                                  value={course.progress || 0}
                                  sx={{ height: 8, borderRadius: 4 }}
                                />
                              </Box>
                              <Typography variant="caption">
                                {course.progress || 0}%
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          {course.completion_date ?
                            new Date(course.completion_date).toLocaleDateString() : "N/A"}
                        </TableCell>
                        <TableCell>{course.comments || "N/A"}</TableCell>
                        <TableCell>
                          <StatusChip>{course.status || "N/A"}</StatusChip>
                        </TableCell>
                        <TableCell>
                          <ActionIconButton
                            size="small"
                            onClick={(e) => handleMenuClick(e, course.assignment_id)}
                          >
                            <ArrowForward />
                          </ActionIconButton>
                          <Menu
                            anchorEl={anchorElMap[course.assignment_id]}
                            open={Boolean(anchorElMap[course.assignment_id])}
                            onClose={() => handleMenuClose(course.assignment_id)}
                          >
                            {["Completed", "Incomplete", "Learning Suspended", "Completed with Delay"].map((status) => (
                              <MenuItem
                                key={status}
                                onClick={() => {
                                  handleMenuClose(course.assignment_id);
                                  handleStatusUpdate(course.assignment_id, status);
                                }}
                              >
                                {status}
                              </MenuItem>
                            ))}
                          </Menu>
                          <IconButton size="small">
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

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}

export default function CourseTracker() {
  const { requestId } = useParams();
  const [page, setPage] = useState(1);
  const [learners, setLearners] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [selectedEmployees, setSelectedEmployees] = useState([]);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchLearnersData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `http://localhost:8000/api/getEmpNewTrainingRequested/getEmpNewTrainingRequested/?requestid=${requestId}`
        );
        const data = await response.json();

        const formattedLearners = data.map(item => ({
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
        }));

        setLearners(formattedLearners);
      } catch (error) {
        console.error("Error fetching learners:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLearnersData();
  }, [requestId]);

  const totalPages = Math.ceil(learners.length / itemsPerPage);
  const currentItems = learners.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handleSelectEmployee = (empId) => {
    setSelectedEmployees(prev =>
      prev.includes(empId) ? prev.filter(id => id !== empId) : [...prev, empId]
    );
  };

  return (
    <Box sx={{
      backgroundColor: "#FFFFFF",
      borderRadius: "15px",
      p: 3,
      boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)",
      position: "relative"
    }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">Assign Courses & Track Progress</Typography>
        <Box sx={{ display: "flex", gap: 2 }}>
          <HeaderButton variant="outlined">Send Reminder</HeaderButton>
          <HeaderButton
            variant="outlined"
            onClick={() => setShowAssignModal(true)}
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
          <StyledTableContainer component={Paper}>
            <Table aria-label="course-tracker-table">
              <TableHead sx={{ backgroundColor: "#FAFAFA" }}>
                <TableRow>
                  <TableCell width="48px" />
                  <TableCell padding="checkbox" width="48px" />
                  <TableCell>Name</TableCell>
                  <TableCell align="center">Courses</TableCell>
                  <TableCell align="center">Available From</TableCell>
                  <TableCell align="center">Bandwidth</TableCell>
                  <TableCell align="center">Weekends</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {currentItems.map((row) => (
                  <Row
                    key={row.emp_id}
                    row={row}
                    isExpanded={expandedId === row.emp_id}
                    isSelected={selectedEmployees.includes(row.emp_id)}
                    onToggleExpand={(id) => 
                      setExpandedId(prev => prev === id ? null : id)
                    }
                    onSelect={() => handleSelectEmployee(row.emp_id)}
                    onAssignCourse={(id) => {
                      setSelectedEmployees([id]);
                      setShowAssignModal(true);
                    }}
                  />
                ))}
              </TableBody>
            </Table>
          </StyledTableContainer>

          <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            mt: 2,
            alignItems: "center"
          }}>
            <Typography variant="body2" color="text.secondary">
              Showing {currentItems.length} of {learners.length} records
            </Typography>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(e, value) => setPage(value)}
              shape="rounded"
              color="primary"
            />
          </Box>
        </>
      )}

      <AssignCourseModal
        open={showAssignModal}
        onClose={() => {
          setShowAssignModal(false);
          setSelectedEmployees([]);
        }}
        employeeIds={selectedEmployees}
        requestId={requestId}
      />
    </Box>
  );
}