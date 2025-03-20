 
import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Box, Typography, TextField, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Button, FormControl, Select, MenuItem, IconButton, InputAdornment, TextareaAutosize, CircularProgress, RadioGroup, FormControlLabel, Radio, Autocomplete
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
 import{useNavigate} from 'react-router-dom';
 
const AssignCourseModal = ({ open, onClose, employeeIds, requestId,coursesAssigned}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [availableCourses, setAvailableCourses] = useState([]);
  const [courseTypes, setCourseTypes] = useState([]);
  const [courses, setCourses] = useState([]);
  const [specialComments, setSpecialComments] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const learningTypeOptions = ['Full Stack', 'Upskill', 'Cross Skill'];
  const [learningType, setLearningType] = useState('');
  const [mentors, setMentors] = useState([]);
  const [mentorLoading, setMentorLoading] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchCourseTypes = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/course-types/types');
        const data = await response.json();
        setCourseTypes(data);
      } catch (error) {
        console.error('Error fetching course types:', error);
      }
    };
    fetchCourseTypes();
  }, []);
 
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        if (searchQuery.trim()) {
          setLoading(true);
          console.log('Search Query:', searchQuery); // Log the search query
          const response = await fetch(
            `http://localhost:8000/api/courses/search?query=${encodeURIComponent(searchQuery)}`
          );
          const data = await response.json();
          console.log('Fetched Courses:', data); // Log the fetched courses
          setAvailableCourses(data);
        } else {
          setAvailableCourses([]); // Clear the courses if search query is empty
        }
      } catch (error) {
        console.error('Error searching courses:', error);
      } finally {
        setLoading(false);
      }
    };
 
   fetchCourses();
  }, [searchQuery]);
 
  const handleAddCourse = (course) => {
    if (!courses.some(c => c.course_id === course.course_id)) {
      setCourses(prev => [
        ...prev,
        {
          course_id: course.course_id,
          name: course.course_name,
          mentor: '',
          coursetype: '',
          completionDate: '',
          learning_type: learningType
        }
      ]);
    }
  };
 
  const handleAssign = async () => {
    try {
      setSubmitting(true);
      for (const employeeId of employeeIds) {
        for (const course of courses) {
          const payload = {
            requestid: requestId,
            employee_id: employeeId,
            mentor_id: course.mentor,
            course_id: course.course_id,
            coursetype_id: course.coursetype,
            completion_date: course.completionDate,
            comments: specialComments,
            learning_type: learningType,
          };
 
          console.log('Payload:', payload); // Log the payload to verify its content
 
          await fetch('http://localhost:8000/api/assign-courses/assign', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
        }
      }
      onClose();
     navigate(`/learning-initiated-details/${requestId}`, { replace: true }); // Navigate to the specific page
   
    } catch (error) {
      console.error('Error assigning courses:', error);
    } finally {
      setSubmitting(false);
    }
  };
 
  const handleMentorSearch = async (query) => {
    try {
      setMentorLoading(true);
      const response = await fetch(`http://localhost:8000/api/employees/searchWithoutManager?name=${encodeURIComponent(query)}`);
      const data = await response.json();
      setMentors(data);
    } catch (error) {
      console.error('Error fetching mentors:', error);
    } finally {
      setMentorLoading(false);
    }
  };
 
  const isFormValid = () => {
    if (courses.length === 0 || !learningType) return false;
    for (const course of courses) {
      if (!course.mentor || !course.coursetype || !course.completionDate) {
        return false;
      }
    }
    return true;
  };
 
 
  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 800,
        bgcolor: 'background.paper',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        <Typography variant="h6" sx={{ mb: 3 }}>
          Assign Course to {employeeIds.length > 1 ? `${employeeIds.length} Employees` : 'Employee'}
        </Typography>
       <Box style={{backgroundColor:"#FCFCFC ",border:"1px solid #C9C9C9",padding:"10px",borderRadius:"5px"}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ width: '48%' }}>
            <Typography component="label" htmlFor="select-course" sx={{ mb: 1.7, display: 'block' }}>
              Select Course
            </Typography>
            <Autocomplete
              freeSolo
              options={availableCourses}
              getOptionLabel={(option) => option.course_name}
              onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue);
              }}
              noOptionsText="No courses found"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  placeholder="Search courses..."
                 
                  InputProps={{
                   
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{fontSize:"20px"}} />
                      </InputAdornment>
                     
                    ),
                    sx: {
                      height: '30px', // Adjust the height as needed
                     padding: '0px 0px 0px 5px !important', // Adjust the padding as needed
                      fontSize: '12px',
                    },
                  }}
                 
                />
              )}
              onChange={(event, value) => {
                if (value) {
                  handleAddCourse(value);
                }
              }}
              disabled={coursesAssigned+courses.length >=3}
            />
            {loading && <CircularProgress size={24} sx={{ mt: 1 }} />}
          </Box>
 
          <Box sx={{ width: '48%' }}>
            <FormControl fullWidth>
              <Typography component="label" htmlFor="learning-type" sx={{ mb: 1, display: 'block' }}>
                Learning Type
              </Typography>
              <RadioGroup
                row
                name="learning-type"
                value={learningType}
                onChange={(e) => setLearningType(e.target.value)}
              >
                {learningTypeOptions.map((type) => (
                  <FormControlLabel
                    key={type}
                    value={type}
                    control={<Radio />}
                    label={type}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
        </Box>
        {console.log("Cousrsrs COunt",coursesAssigned)}
        {courses.length === 0 ? (
          <Box sx={{ bgcolor: '#F5F5F5', p: 3, borderRadius: 2, textAlign: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              No courses selected
            </Typography>
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ mb: 3 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Course Name</TableCell>
                  <TableCell>Mentor</TableCell>
                  <TableCell>Completion Date</TableCell>
                  <TableCell>Course Type</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {courses.map((course) => (
                  <TableRow key={course.course_id}>
                    <TableCell>{course.name}</TableCell>
                    <TableCell>
                      <Autocomplete
                        freeSolo
                        options={mentors}
                        getOptionLabel={(option) => option.emp_name}
                        onInputChange={(event, newInputValue) => {
                          handleMentorSearch(newInputValue);
                        }}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            fullWidth
                            placeholder="Search mentors..."
                            InputProps={{
                              ...params.InputProps,
                              startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                              ),
                            }}
                          />
                        )}
                        onChange={(event, value) => {
                          if (value) {
                            setCourses(prev =>
                              prev.map(c =>
                                c.course_id === course.course_id
                                  ? { ...c, mentor: value.emp_id }
                                  : c
                              )
                            );
                          }
                        }}
                      />
                      {mentorLoading && <CircularProgress size={24} sx={{ mt: 1 }} />}
                    </TableCell>
                    <TableCell>
                      <TextField
                        type="date"
                        size="small"
                        fullWidth
                        inputProps={{
                          min: new Date().toISOString().split("T")[0], // Set the minimum date to today
                        }}
                        InputProps={{
                         
                          startAdornment: (
                            <InputAdornment position="start">
                              <CalendarTodayIcon fontSize="small" />
                            </InputAdornment>
                          ),
                        }}
                        value={course.completionDate}
                        onChange={(e) => setCourses(prev =>
                          prev.map(c =>
                            c.course_id === course.course_id
                              ? { ...c, completionDate: e.target.value }
                              : c
                          )
                        )}
                      />
                    </TableCell>
                    <TableCell>
                      <FormControl fullWidth size="small">
                        <Select
                          value={course.coursetype}
                          onChange={(e) => setCourses(prev =>
                            prev.map(c =>
                              c.course_id === course.course_id
                                ? { ...c, coursetype: e.target.value }
                                : c
                            )
                          )}
                        >
                          <MenuItem value="">Select Type</MenuItem>
                          {courseTypes.map(type => (
                            <MenuItem key={type.type_id} value={type.type_id}>
                              {type.type_name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => setCourses(prev =>
                          prev.filter(c => c.course_id !== course.course_id)
                        )}
                      >
                        <CloseIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
 
        <Box sx={{ mb: 3 }}>
          <Typography gutterBottom>Special Comments</Typography>
          <TextareaAutosize
            minRows={3}
            style={{
              width: '97%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
            value={specialComments}
            onChange={(e) => setSpecialComments(e.target.value)}
          />
        </Box>
 
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            // variant="outlined"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAssign}
            disabled={submitting ||courses.length === 0|| coursesAssigned+courses.length > 3||!isFormValid()}
          >
            {submitting ? <CircularProgress size={24} /> : 'Assign'}
          </Button>
        </Box>
      </Box>
      </Box>
    </Modal>
  );
};
AssignCourseModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  employeeIds: PropTypes.array.isRequired,
  requestId: PropTypes.string.isRequired,
  coursesAssigned:PropTypes.number.isRequired
};
 
export default AssignCourseModal;
 
 