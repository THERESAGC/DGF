import { useState, useEffect, useContext } from "react"
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Box,
  CircularProgress,
  Divider,
  Paper,
  LinearProgress,
  Modal,
  IconButton,
  Button,
} from "@mui/material"
import { styled } from "@mui/material/styles"
import {
  School,
  Schedule,
  Person,
  CalendarMonth,
  Info,
  Close as CloseIcon,
  ArrowForward,
  Description,
  Category,
} from "@mui/icons-material"
import axios from "axios"
import AuthContext from "../Auth/AuthContext"

// Styled components with improved spacing and softer colors
const MainContainer = styled(Paper)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(5),
  borderRadius: "12px",
  backgroundColor: "#ffffff",
  boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.04)",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}))

const StyledCard = styled(Card)(({ theme }) => ({
  height: "100%",
  display: "flex",
  flexDirection: "column",
  transition: "transform 0.3s, box-shadow 0.3s",
  borderRadius: "10px",
  // border: "1px solid #000000",
  boxShadow: "0px 2px 8px rgba(0, 0, 0, 0.08)",
  cursor: "pointer",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.12)",
  },
}))

const CourseTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  display: "-webkit-box",
  WebkitLineClamp: 3,
  WebkitBoxOrient: "vertical",
  overflow: "hidden",
  textOverflow: "ellipsis",
  minHeight: "60px",
  lineHeight: "1.3",
  color: "#2c3e50", // Darker, more professional color
}))

const StatusChip = styled(Chip)(({ theme, status }) => {
  let backgroundColor = "#e3f2fd" // Softer blue for default
  let textColor = "#1565c0"

  if (status === "Completed") {
    backgroundColor = "#e8f5e9" // Softer green
    textColor = "#2e7d32"
  } else if (status === "Incomplete") {
    backgroundColor = "#fff8e1" // Softer amber
    textColor = "#f57f17"
  }

  return {
    backgroundColor,
    color: textColor,
    fontWeight: 500,
    "& .MuiChip-label": {
      padding: "0 12px",
    },
  }
})

const InfoItem = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "flex-start",
  marginBottom: theme.spacing(2),
  "& svg": {
    marginRight: theme.spacing(1.5),
    marginTop: "2px",
    color: "#546e7a", // More subtle icon color
    fontSize: "1.2rem",
  },
}))

const EmptyState = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(8),
  textAlign: "center",
  backgroundColor: theme.palette.background.default,
  borderRadius: theme.shape.borderRadius,
  marginTop: theme.spacing(4),
}))

const ProgressWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
}))

const SectionDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(2, 0),
  borderColor: "rgba(0, 0, 0, 0.08)",
}))

const PageTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#37474f", // More professional, less bright
  marginBottom: theme.spacing(1),
}))

// Modal styles
const ModalContainer = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: 800,
  maxHeight: "75vh",
  overflowY: "auto",
  backgroundColor: "#ffffff",
  borderRadius: "12px",
  boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
  padding: theme.spacing(4),
  // Hide scrollbar
  "&::-webkit-scrollbar": {
    display: "none",
  },
  "-ms-overflow-style": "none", // For Internet Explorer and Edge
  "scrollbar-width": "none", // For Firefox
}))

const ModalHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-start",
  marginBottom: theme.spacing(3),
}))

const ModalSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}))

const ModalTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#1a237e",
  marginBottom: theme.spacing(1),
}))

const ModalDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(3, 0),
  borderColor: "rgba(0, 0, 0, 0.12)",
}))

const DetailLabel = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  color: "#37474f",
  marginBottom: theme.spacing(1),
}))

const DetailValue = styled(Typography)(({ theme }) => ({
  color: "#455a64",
  marginBottom: theme.spacing(2),
}))

const MyCourses = () => {
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/employee-courses/${user.emp_id}`)
        setCourses(response.data.data || [])
        setLoading(false)
      } catch (err) {
        console.error("Error fetching courses:", err)
      
        setLoading(false)
      }
    }

    fetchCourses()
  }, [user])

  // Format date to a more readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Not specified"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleCardClick = (course) => {
    setSelectedCourse(course)
    setModalOpen(true)
  }

  const handleCloseModal = () => {
    setModalOpen(false)
  }

  // Render loading state
  if (loading) {
    return (
      <Container maxWidth="lg">
        <MainContainer>
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
            <CircularProgress size={40} thickness={4} sx={{ color: "#546e7a" }} />
          </Box>
        </MainContainer>
      </Container>
    )
  }

  // Render error state
  if (error) {
    return (
      <Container maxWidth="lg">
        <MainContainer>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
            <Info color="error" sx={{ fontSize: 60, mb: 3, opacity: 0.8 }} />
            <Typography variant="h5" color="error" gutterBottom sx={{ fontWeight: 500, opacity: 0.9 }}>
              No Course Found
            </Typography>
            <Typography variant="body1" sx={{ color: "#455a64" }}>
              {error}
            </Typography>
          </Box>
        </MainContainer>
      </Container>
    )
  }

  // Render empty state
  if (courses.length === 0) {
    return (
      <Container maxWidth="lg">
        <MainContainer>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={8}>
            <School sx={{ fontSize: 60, mb: 3, color: "#546e7a" }} />
            <Typography variant="h5" gutterBottom sx={{ fontWeight: 500, color: "#37474f" }}>
              No Courses Assigned
            </Typography>
            <Typography variant="body1" sx={{ color: "#546e7a" }}>
              You don't have any courses assigned to you at the moment.
            </Typography>
          </Box>
        </MainContainer>
      </Container>
    )
  }

  // Render courses
  return (
    <Container maxWidth="lg">
      <MainContainer>
        <Box mb={5}>
          <PageTitle variant="h4" component="h1">
            My Courses
          </PageTitle>
          <Divider sx={{ mb: 4, borderColor: "rgba(0, 0, 0, 0.1)", borderWidth: 1 }} />
        </Box>

        <Grid container spacing={4}>
          {courses.map((course) => (
            <Grid item xs={12} md={6} lg={4} key={course.assignment_id}>
              <StyledCard onClick={() => handleCardClick(course)}>
                <CardHeader
                  title={<CourseTitle variant="h6">{course.course_name}</CourseTitle>}
                  sx={{ pb: 1, pt: 3, px: 3 }}
                />

                <SectionDivider />

                <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column", p: 3 }}>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="body2" fontWeight="medium" sx={{ color: "#455a64" }}>
                      Status:
                    </Typography>
                    <StatusChip label={course.status} status={course.status} size="small" />
                  </Box>

                  <ProgressWrapper>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body2" fontWeight="medium" sx={{ color: "#455a64" }}>
                        Progress:
                      </Typography>
                      <Typography variant="body2" sx={{ color: "#455a64" }}>
                        {course.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{
                        height: 8,
                        borderRadius: 5,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: course.status === "Completed" ? "#4caf50" : "#1976d2",
                          borderRadius: 5,
                        },
                      }}
                    />
                  </ProgressWrapper>

                  <InfoItem>
                    <Person />
                    <Typography variant="body2" sx={{ color: "#455a64" }}>
                      <span style={{ fontWeight: 500, marginRight: "4px" }}>Mentor:</span>
                      {course.mentor_name}
                    </Typography>
                  </InfoItem>

                  <Box display="flex" justifyContent="flex-end" mt={2}>
                    <Typography variant="body2" sx={{ color: "#1976d2", display: "flex", alignItems: "center" }}>
                      View Details <ArrowForward sx={{ fontSize: "1rem", ml: 0.5 }} />
                    </Typography>
                  </Box>
                </CardContent>
              </StyledCard>
            </Grid>
          ))}
        </Grid>

        {/* Course Details Modal */}
        <Modal
          open={modalOpen}
          onClose={handleCloseModal}
          aria-labelledby="course-details-modal"
          aria-describedby="detailed-information-about-the-course"
        >
          <ModalContainer>
            {selectedCourse && (
              <>
                <ModalHeader>
                  <Box>
                    <ModalTitle variant="h5" id="course-details-modal">
                      {selectedCourse.course_name}
                    </ModalTitle>
                    <Typography variant="subtitle1" sx={{ color: "#546e7a" }}>
                      {selectedCourse.coursetype_name}
                    </Typography>
                  </Box>
                  <IconButton
                    onClick={handleCloseModal}
                    sx={{
                      color: "#455a64",
                      "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.04)" },
                    }}
                  >
                    <CloseIcon />
                  </IconButton>
                </ModalHeader>

                <ModalDivider />

                <ModalSection>
                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <DetailLabel variant="h6">Status</DetailLabel>
                    <StatusChip label={selectedCourse.status} status={selectedCourse.status} />
                  </Box>

                  <ProgressWrapper sx={{ mb: 4 }}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                      <Typography variant="body1" fontWeight="medium" sx={{ color: "#455a64" }}>
                        Progress:
                      </Typography>
                      <Typography variant="body1" sx={{ color: "#455a64" }}>
                        {selectedCourse.progress}%
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={selectedCourse.progress}
                      sx={{
                        height: 10,
                        borderRadius: 5,
                        backgroundColor: "rgba(0, 0, 0, 0.05)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: selectedCourse.status === "Completed" ? "#4caf50" : "#1976d2",
                          borderRadius: 5,
                        },
                      }}
                    />
                  </ProgressWrapper>
                </ModalSection>

                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <ModalSection>
                      <DetailLabel variant="h6">Course Information</DetailLabel>

                      <InfoItem>
                        <Category />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#455a64" }}>
                            Course Type
                          </Typography>
                          <DetailValue variant="body1">{selectedCourse.coursetype_name || "Not specified"}</DetailValue>
                        </Box>
                      </InfoItem>

                      <InfoItem>
                        <Description />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#455a64" }}>
                            Description
                          </Typography>
                          <DetailValue variant="body1">
                            {selectedCourse.course_description ? (
                              <div dangerouslySetInnerHTML={{ __html: selectedCourse.course_description }} />
                            ) : (
                              "No description available"
                            )}
                          </DetailValue>
                        </Box>
                      </InfoItem>

                      <InfoItem>
                        <Info />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#455a64" }}>
                            Learning Type
                          </Typography>
                          <DetailValue variant="body1">{selectedCourse.learning_type || "Not specified"}</DetailValue>
                        </Box>
                      </InfoItem>
                    </ModalSection>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <ModalSection>
                      <DetailLabel variant="h6">Assignment Details</DetailLabel>

                      <InfoItem>
                        <Person />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#455a64" }}>
                            Mentor
                          </Typography>
                          <DetailValue variant="body1">{selectedCourse.mentor_name || "Not assigned"}</DetailValue>
                        </Box>
                      </InfoItem>

                      <InfoItem>
                        <CalendarMonth />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#455a64" }}>
                            Assigned Date
                          </Typography>
                          <DetailValue variant="body1">{formatDate(selectedCourse.assigned_date)}</DetailValue>
                        </Box>
                      </InfoItem>

                      <InfoItem>
                        <Schedule />
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 500, color: "#455a64" }}>
                            Due Date
                          </Typography>
                          <DetailValue variant="body1">{formatDate(selectedCourse.completion_date)}</DetailValue>
                        </Box>
                      </InfoItem>
                    </ModalSection>
                  </Grid>
                </Grid>

                {selectedCourse.comments && (
                  <ModalSection>
                    <DetailLabel variant="h6">Comments</DetailLabel>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        backgroundColor: "rgba(0, 0, 0, 0.02)",
                        borderRadius: 2,
                        border: "1px solid rgba(0, 0, 0, 0.08)",
                      }}
                    >
                      <Typography variant="body1" sx={{ color: "#455a64", fontStyle: "italic" }}>
                        {selectedCourse.comments}
                      </Typography>
                    </Paper>
                  </ModalSection>
                )}

                <Box display="flex" justifyContent="flex-end" mt={3}>
                  <Button
                    variant="contained"
                    onClick={handleCloseModal}
                    sx={{
                      backgroundColor: "#1a237e",
                      "&:hover": { backgroundColor: "#0d1b60" },
                      px: 4,
                    }}
                  >
                    Close
                  </Button>
                </Box>
              </>
            )}
          </ModalContainer>
        </Modal>
      </MainContainer>
    </Container>
  )
}

export default MyCourses

